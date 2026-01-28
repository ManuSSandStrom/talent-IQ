import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useEndSession, useJoinSession, useSessionById, useAdmitGuest } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getDifficultyBadgeClass } from "../lib/utils";
import { Loader2Icon, LogOutIcon, PhoneOffIcon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";
import { socket } from "../lib/socket";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";
import { MailIcon } from "lucide-react";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;
  const isGuest = session?.guestId && session.guestId === streamUser?.id;
  const isWaiting = session?.guestStatus === "waiting" && isGuest;
  const guestIsWaiting = session?.guestStatus === "waiting" && session?.guestId;

  const [streamToken, setStreamToken] = useState(null);
  const [streamUser, setStreamUser] = useState(null);

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session,
    loadingSession,
    isHost,
    isParticipant,
    streamToken,
    streamUser
  );

  // find the problem data based on session problem title
  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(problemData?.starterCode?.[selectedLanguage] || "");

  // Invite Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  // Socket: Join room & Listen for updates
  useEffect(() => {
    socket.connect();
    socket.emit("join_session", id);

    const handleCodeUpdate = (newCode) => {
      // Avoid overwriting if you are the one typing? 
      // Actually simple handling: just set code. 
      // Ideally we check if code is different to avoid cursor jumps, but Monaco handles value updates well.
      setCode((currentCode) => {
         if (currentCode !== newCode) return newCode;
         return currentCode;
      });
    };

    socket.on("code_update", handleCodeUpdate);

    return () => {
      socket.off("code_update", handleCodeUpdate);
      socket.disconnect();
    };
  }, [id]);

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setIsSendingInvite(true);
    try {
      // Get fresh token from Clerk
      const token = await getToken();
      
      if (!token) {
        toast.error("Authentication error. Please sign in again.");
        setIsSendingInvite(false);
        return;
      }

      await axiosInstance.post("/invite", {
        recipientEmail: inviteEmail,
        sessionId: id,
        hostName: user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Host",
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success("Invitation sent successfully!");
      setIsInviteOpen(false);
      setInviteEmail("");
    } catch (error) {
      console.error("Invite error:", error);
      const errorMessage = error.response?.data?.message || "Failed to send invitation";
      toast.error(errorMessage);
    } finally {
      setIsSendingInvite(false);
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("code_change", { sessionId: id, code: newCode });
  };

  // auto-join session if user is not already a participant and not the host
  useEffect(() => {
    // If user is logged in, auto-join
    if (user && !isHost && !isParticipant) {
      joinSessionMutation.mutate(id, {
        onSuccess: (data) => {
          if (data.token) setStreamToken(data.token);
          if (data.joinedAs) setStreamUser(data.joinedAs);
          refetch();
        },
      });
    }
  }, [session, user, loadingSession, isHost, isParticipant, id]);

  // Guest Join State
  const [guestName, setGuestName] = useState("");
  const [showGuestJoinModal, setShowGuestJoinModal] = useState(false);

  useEffect(() => {
     if (!loadingSession && session && !user && !isHost & !isParticipant) {
         setShowGuestJoinModal(true);
     }
  }, [loadingSession, session, user, isHost, isParticipant]);

  const handleGuestJoin = (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    
    joinSessionMutation.mutate(
      { id, guestName }, // api needs to support passing body args in the mutation wrapper
      {
        onSuccess: (data) => {
           // if guest, they might be put in waiting room. 
           // session object in cache might need update or we wait for refetch.
           // actually refetch is called.
           if (data.token) setStreamToken(data.token);
           if (data.joinedAs) setStreamUser(data.joinedAs);
           setShowGuestJoinModal(false);
           refetch();
        }
      }
    );
  };

  const handleAdmitGuest = async () => {
     try {
        await axiosInstance.post(`/sessions/${id}/admit`);
        toast.success("Guest admitted!");
        refetch();
     } catch (err) {
        toast.error("Failed to admit guest");
        console.error(err);
     }
  };

  // redirect the "participant" when session ends
  useEffect(() => {
    if (!session || loadingSession) return;

    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  // update code when problem loads or changes
  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    // use problem-specific starter code
    const starterCode = problemData?.starterCode?.[newLang] || "";
    setCode(starterCode);
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    
    // Test Case Validation
    if(result.run && result.run.output && problemData?.expectedOutput?.[selectedLanguage]) {
        const actualOutput = result.run.output.trim();
        const expectedOutput = problemData.expectedOutput[selectedLanguage].trim();
        
        // Normalize: remove all whitespace/newlines for loose comparison (handles [ 1, 2 ] vs [1,2])
        const normalize = (str) => str.replace(/\s+/g, '');
        
        if(normalize(actualOutput) === normalize(expectedOutput)) {
            result.run.output += "\n\n✅ ALL TEST CASES PASSED!";
            toast.success("Correct! All test cases passed! 🌟", { duration: 4000 });
        } else {
             result.run.output += `\n\n❌ TEST CASES FAILED\n\nExpected Output:\n${expectedOutput}\n\nActual Output:\n${actualOutput}`;
             toast.error("Test cases failed. Check output.", { duration: 3000 });
        }
    }

    setOutput(result);
    setIsRunning(false);
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session? All participants will be notified.")) {
      // this will navigate the HOST to dashboard
      endSessionMutation.mutate({ id, code }, { onSuccess: () => navigate("/dashboard") });
    }
  };

  const handleVideoLeave = () => {
     if (isHost) {
        if (confirm("Leaving as host will end the session for everyone. Continue?")) {
           endSessionMutation.mutate({ id, code: "" }); // You might want to save code here if needed
        }
     } else {
        navigate("/dashboard");
     }
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* LEFT PANEL - CODE EDITOR & PROBLEM DETAILS */}
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              {/* PROBLEM DSC PANEL */}
              <Panel defaultSize={50} minSize={20}>
                <div className="h-full overflow-y-auto bg-base-200">
                  {/* HEADER SECTION */}
                  <div className="p-6 bg-base-100 border-b border-base-300">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h1 className="text-3xl font-bold text-base-content">
                          {session?.problem || "Loading..."}
                        </h1>
                        {problemData?.category && (
                          <p className="text-base-content/60 mt-1">{problemData.category}</p>
                        )}
                        <p className="text-base-content/60 mt-2">
                          Host: {session?.host?.name || "Loading..."} •{" "}
                          {session?.participant ? 2 : 1}/2 participants
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Invite Button */}
                        {!session?.participant && session?.status === "active" && (
                           <button 
                             className="btn btn-sm btn-outline gap-2"
                             onClick={() => setIsInviteOpen(true)}
                           >
                              <MailIcon className="w-4 h-4" />
                              Invite
                           </button>
                        )}
                        <span
                          className={`badge badge-lg ${getDifficultyBadgeClass(
                            session?.difficulty
                          )}`}
                        >
                          {session?.difficulty.slice(0, 1).toUpperCase() +
                            session?.difficulty.slice(1) || "Easy"}
                        </span>
                        {isHost && session?.status === "active" && (
                          <button
                            onClick={handleEndSession}
                            disabled={endSessionMutation.isPending}
                            className="btn btn-error btn-sm gap-2"
                          >
                            {endSessionMutation.isPending ? (
                              <Loader2Icon className="w-4 h-4 animate-spin" />
                            ) : (
                              <LogOutIcon className="w-4 h-4" />
                            )}
                            End Session
                          </button>
                        )}
                        {session?.status === "completed" && (
                          <span className="badge badge-ghost badge-lg">Completed</span>
                        )}
                        {/* Admit Button for Host */}
                        {isHost && guestIsWaiting && (
                             <div className="flex items-center gap-2 animate-pulse mr-2">
                                <span className="text-warning font-bold text-sm">Guest Waiting: {session?.guestName}</span>
                                <button 
                                  className="btn btn-sm btn-success"
                                  onClick={handleAdmitGuest}
                                >
                                  Admit
                                </button>
                             </div>
                        )}
                        </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* problem desc */}
                    {problemData?.description && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                        <h2 className="text-xl font-bold mb-4 text-base-content">Description</h2>
                        <div className="space-y-3 text-base leading-relaxed">
                          <p className="text-base-content/90">{problemData.description.text}</p>
                          {problemData.description.notes?.map((note, idx) => (
                            <p key={idx} className="text-base-content/90">
                              {note}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* examples section */}
                    {problemData?.examples && problemData.examples.length > 0 && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                        <h2 className="text-xl font-bold mb-4 text-base-content">Examples</h2>

                        <div className="space-y-4">
                          {problemData.examples.map((example, idx) => (
                            <div key={idx}>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="badge badge-sm">{idx + 1}</span>
                                <p className="font-semibold text-base-content">Example {idx + 1}</p>
                              </div>
                              <div className="bg-base-200 rounded-lg p-4 font-mono text-sm space-y-1.5">
                                <div className="flex gap-2">
                                  <span className="text-primary font-bold min-w-[70px]">
                                    Input:
                                  </span>
                                  <span>{example.input}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="text-secondary font-bold min-w-[70px]">
                                    Output:
                                  </span>
                                  <span>{example.output}</span>
                                </div>
                                {example.explanation && (
                                  <div className="pt-2 border-t border-base-300 mt-2">
                                    <span className="text-base-content/60 font-sans text-xs">
                                      <span className="font-semibold">Explanation:</span>{" "}
                                      {example.explanation}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Constraints */}
                    {problemData?.constraints && problemData.constraints.length > 0 && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                        <h2 className="text-xl font-bold mb-4 text-base-content">Constraints</h2>
                        <ul className="space-y-2 text-base-content/90">
                          {problemData.constraints.map((constraint, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-primary">•</span>
                              <code className="text-sm">{constraint}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              <Panel defaultSize={50} minSize={20}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70} minSize={30}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={handleCodeChange}
                      onRunCode={handleRunCode}
                      readOnly={isHost}
                    />
                  </Panel>

                  <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                  <Panel defaultSize={30} minSize={15}>
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* RIGHT PANEL - VIDEO CALLS & CHAT */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full bg-base-200 p-4 overflow-auto">
              {isInitializingCall ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
                    <p className="text-lg">Connecting to video call...</p>
                  </div>
                </div>
              ) : isWaiting ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center p-8 bg-base-100 rounded-xl shadow-lg border border-warning/20">
                      <Loader2Icon className="w-16 h-16 mx-auto animate-spin text-warning mb-4" />
                      <h2 className="text-2xl font-bold mb-2">Waiting for Host</h2>
                      <p className="text-lg text-base-content/70">Please wait while the host admits you into the session...</p>
                    </div>
                  </div>
              ) : !streamClient || !call ? (
                <div className="h-full flex items-center justify-center">
                  <div className="card bg-base-100 shadow-xl max-w-md">
                    <div className="card-body items-center text-center">
                      <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-4">
                        <PhoneOffIcon className="w-12 h-12 text-error" />
                      </div>
                      <h2 className="card-title text-2xl">Connection Failed</h2>
                      <p className="text-base-content/70">Unable to connect to the video call</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI chatClient={chatClient} channel={channel} onLeave={handleVideoLeave} />
                    </StreamCall>
                  </StreamVideo>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Invite Participant</h3>
            <form onSubmit={handleSendInvite}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email Address</span>
                </label>
                <input
                  type="email"
                  placeholder="friend@example.com"
                  className="input input-bordered w-full"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>
              <div className="modal-action">
                 <button 
                   type="button" 
                   className="btn" 
                   onClick={() => setIsInviteOpen(false)}
                   disabled={isSendingInvite}
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   className="btn btn-primary"
                   disabled={isSendingInvite}
                 >
                   {isSendingInvite ? <Loader2Icon className="animate-spin w-4 h-4"/> : "Send Invite"}
                 </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={() => setIsInviteOpen(false)}></div>
        </div>
      )}

      {/* Guest Join Modal */}
      {showGuestJoinModal && (
        <div className="modal modal-open bg-black/80">
          <div className="modal-box max-w-sm">
             <h3 className="font-bold text-xl mb-4 text-center">Join Session</h3>
             <p className="text-center text-base-content/70 mb-6">Enter your name to join as a guest</p>
             <form onSubmit={handleGuestJoin}>
               <div className="form-control mb-4">
                 <input 
                    type="text" 
                    placeholder="Your Name (e.g. John Doe)" 
                    className="input input-bordered w-full"
                    autoFocus
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                 />
               </div>
               <button 
                  type="submit" 
                  className="btn btn-primary w-full"
                  disabled={joinSessionMutation.isPending}
               >
                  {joinSessionMutation.isPending ? <Loader2Icon className="animate-spin"/> : "Join Session"}
               </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionPage;
