export const PROBLEMS = {
  "two-sum": {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array | Hash Table",
    description: {
      text: "Given an array of integers nums and an integer target, return indices of the two numbers in the array such that they add up to target.",
      notes: [
        "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        "You can return the answer in any order.",
      ],
    },
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists",
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your solution here
  
}

// Test cases
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]
console.log(twoSum([3, 2, 4], 6)); // Expected: [1, 2]
console.log(twoSum([3, 3], 6)); // Expected: [0, 1]`,
      python: `def twoSum(nums, target):
    # Write your solution here
    pass

# Test cases
print(twoSum([2, 7, 11, 15], 9))  # Expected: [0, 1]
print(twoSum([3, 2, 4], 6))  # Expected: [1, 2]
print(twoSum([3, 3], 6))  # Expected: [0, 1]`,
      java: `import java.util.*;

class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
        return new int[0];
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(twoSum(new int[]{2, 7, 11, 15}, 9))); // Expected: [0, 1]
        System.out.println(Arrays.toString(twoSum(new int[]{3, 2, 4}, 6))); // Expected: [1, 2]
        System.out.println(Arrays.toString(twoSum(new int[]{3, 3}, 6))); // Expected: [0, 1]
    }
}`,
    },
    expectedOutput: {
      javascript: "[0,1]\n[1,2]\n[0,1]",
      python: "[0, 1]\n[1, 2]\n[0, 1]",
      java: "[0, 1]\n[1, 2]\n[0, 1]",
    },
  },

  "reverse-string": {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    category: "String | Two Pointers",
    description: {
      text: "Write a function that reverses a string. The input string is given as an array of characters s.",
      notes: ["You must do this by modifying the input array in-place with O(1) extra memory."],
    },
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
      },
    ],
    constraints: ["1 <= s.length <= 10^5", "s[i] is a printable ascii character"],
    starterCode: {
      javascript: `function reverseString(s) {
  // Write your solution here
  
}

// Test cases
let test1 = ["h","e","l","l","o"];
reverseString(test1);
console.log(test1); // Expected: ["o","l","l","e","h"]

let test2 = ["H","a","n","n","a","h"];
reverseString(test2);
console.log(test2); // Expected: ["h","a","n","n","a","H"]`,
      python: `def reverseString(s):
    # Write your solution here
    pass

# Test cases
test1 = ["h","e","l","l","o"]
reverseString(test1)
print(test1)  # Expected: ["o","l","l","e","h"]

test2 = ["H","a","n","n","a","h"]
reverseString(test2)
print(test2)  # Expected: ["h","a","n","n","a","H"]`,
      java: `import java.util.*;

class Solution {
    public static void reverseString(char[] s) {
        // Write your solution here
        
    }
    
    public static void main(String[] args) {
        char[] test1 = {'h','e','l','l','o'};
        reverseString(test1);
        System.out.println(Arrays.toString(test1)); // Expected: [o, l, l, e, h] 
        
        char[] test2 = {'H','a','n','n','a','h'};
        reverseString(test2);
        System.out.println(Arrays.toString(test2)); // Expected: [h, a, n, n, a, H]
    }
}`,
    },
    expectedOutput: {
      javascript: '["o","l","l","e","h"]\n["h","a","n","n","a","H"]',
      python: "['o', 'l', 'l', 'e', 'h']\n['h', 'a', 'n', 'n', 'a', 'H']",
      java: "[o, l, l, e, h]\n[h, a, n, n, a, H]",
    },
  },

  "valid-palindrome": {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "String | Two Pointers",
    description: {
      text: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.",
      notes: ["Given a string s, return true if it is a palindrome, or false otherwise."],
    },
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        input: 's = "race a car"',
        output: "false",
        explanation: '"raceacar" is not a palindrome.',
      },
      {
        input: 's = " "',
        output: "true",
        explanation:
          's is an empty string "" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.',
      },
    ],
    constraints: ["1 <= s.length <= 2 * 10^5", "s consists only of printable ASCII characters"],
    starterCode: {
      javascript: `function isPalindrome(s) {
  // Write your solution here
  
}

// Test cases
console.log(isPalindrome("A man, a plan, a canal: Panama")); // Expected: true
console.log(isPalindrome("race a car")); // Expected: false
console.log(isPalindrome(" ")); // Expected: true`,
      python: `def isPalindrome(s):
    # Write your solution here
    pass

# Test cases
print(isPalindrome("A man, a plan, a canal: Panama"))  # Expected: True
print(isPalindrome("race a car"))  # Expected: False
print(isPalindrome(" "))  # Expected: True`,
      java: `class Solution {
    public static boolean isPalindrome(String s) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama")); // Expected: true
        System.out.println(isPalindrome("race a car")); // Expected: false
        System.out.println(isPalindrome(" ")); // Expected: true
    }
}`,
    },
    expectedOutput: {
      javascript: "true\nfalse\ntrue",
      python: "True\nFalse\nTrue",
      java: "true\nfalse\ntrue",
    },
  },

  "maximum-subarray": {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Array | Dynamic Programming",
    description: {
      text: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
      notes: [],
    },
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "The subarray [1] has the largest sum 1.",
      },
      {
        input: "nums = [5,4,-1,7,8]",
        output: "23",
        explanation: "The subarray [5,4,-1,7,8] has the largest sum 23.",
      },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    starterCode: {
      javascript: `function maxSubArray(nums) {
  // Write your solution here
  
}

// Test cases
console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // Expected: 6
console.log(maxSubArray([1])); // Expected: 1
console.log(maxSubArray([5,4,-1,7,8])); // Expected: 23`,
      python: `def maxSubArray(nums):
    # Write your solution here
    pass

# Test cases
print(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))  # Expected: 6
print(maxSubArray([1]))  # Expected: 1
print(maxSubArray([5,4,-1,7,8]))  # Expected: 23`,
      java: `class Solution {
    public static int maxSubArray(int[] nums) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4})); // Expected: 6
        System.out.println(maxSubArray(new int[]{1})); // Expected: 1
        System.out.println(maxSubArray(new int[]{5,4,-1,7,8})); // Expected: 23
    }
}`,
    },
    expectedOutput: {
      javascript: "6\n1\n23",
      python: "6\n1\n23",
      java: "6\n1\n23",
    },
  },

  "container-with-most-water": {
    id: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Array | Two Pointers",
    description: {
      text: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).",
      notes: [
        "Find two lines that together with the x-axis form a container, such that the container contains the most water.",
        "Return the maximum amount of water a container can store.",
        "Notice that you may not slant the container.",
      ],
    },
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation:
          "The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49.",
      },
      {
        input: "height = [1,1]",
        output: "1",
      },
    ],
    constraints: ["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
    starterCode: {
      javascript: `function maxArea(height) {
  // Write your solution here
  
}

// Test cases
console.log(maxArea([1,8,6,2,5,4,8,3,7])); // Expected: 49
console.log(maxArea([1,1])); // Expected: 1`,
      python: `def maxArea(height):
    # Write your solution here
    pass

# Test cases
print(maxArea([1,8,6,2,5,4,8,3,7]))  # Expected: 49
print(maxArea([1,1]))  # Expected: 1`,
      java: `class Solution {
    public static int maxArea(int[] height) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(maxArea(new int[]{1,8,6,2,5,4,8,3,7})); // Expected: 49
        System.out.println(maxArea(new int[]{1,1})); // Expected: 1
    }
}`,
    },
    expectedOutput: {
      javascript: "49\n1",
      python: "49\n1",
      java: "49\n1",
    },
  },
  "3sum": {
    id: "3sum",
    title: "3Sum",
    difficulty: "Medium",
    category: "Array | Two Pointers",
    description: {
      text: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
      notes: [
        "The solution set must not contain duplicate triplets."
      ],
    },
    examples: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]",
      },
      {
        input: "nums = []",
        output: "[]",
      },
      {
        input: "nums = [0]",
        output: "[]",
      },
    ],
    constraints: [
      "0 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5",
    ],
    starterCode: {
      javascript: `function threeSum(nums) {
  // Write your solution here
  
};
`,
      python: `def threeSum(nums):
    # Write your solution here
    pass`,
      java: `import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Write your solution here
        
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.threeSum(new int[]{-1,0,1,2,-1,-4}));
    }
}`
    },
    expectedOutput: {
      javascript: `[[-1,-1,2],[-1,0,1]]`,
      python: `[[-1, -1, 2], [-1, 0, 1]]`,
      java: `[[-1, -1, 2], [-1, 0, 1]]`
    }
  },
  "longest-substring-without-repeating-characters": {
    id: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "String | Sliding Window",
    description: {
      text: "Given a string s, find the length of the longest substring without repeating characters.",
      notes: [],
    },
    examples: [
      {
        input: "s = 'abcabcbb'",
        output: "3",
        explanation: "The answer is 'abc', with the length of 3.",
      },
      {
        input: "s = 'bbbbb'",
        output: "1",
        explanation: "The answer is 'b', with the length of 1.",
      },
      {
        input: "s = 'pwwkew'",
        output: "3",
        explanation: "The answer is 'wke', with the length of 3. Notice that the answer must be a substring, 'pwke' is a subsequence and not a substring.",
      },
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  // Write your solution here
  
};
`,
      python: `def lengthOfLongestSubstring(s):
    # Write your solution here
    pass`,
      java: `import java.util.*;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.lengthOfLongestSubstring("abcabcbb"));
        System.out.println(sol.lengthOfLongestSubstring("bbbbb"));
        System.out.println(sol.lengthOfLongestSubstring("pwwkew"));
    }
}`
    },
    expectedOutput: {
      javascript: `3\n1\n3`,
      python: `3\n1\n3`,
      java: `3\n1\n3`
    }
  },
  "product-of-array-except-self": {
    id: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Array",
    description: {
      text: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
      notes: [
        "The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.",
        "You must write an algorithm that runs in O(n) time and without using the division operation."
      ],
    },
    examples: [
      {
        input: "nums = [1,2,3,4]",
        output: "[24,12,8,6]",
      },
      {
        input: "nums = [-1,1,0,-3,3]",
        output: "[0,0,9,0,0]",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30",
    ],
    starterCode: {
      javascript: `function productExceptSelf(nums) {
  // Write your solution here
  
};
`,
      python: `def productExceptSelf(nums):
    # Write your solution here
    pass`,
      java: `import java.util.*;

class Solution {
    public int[] productExceptSelf(int[] nums) {
        // Write your solution here
        
        return new int[0];
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(Arrays.toString(sol.productExceptSelf(new int[]{1,2,3,4})));
        System.out.println(Arrays.toString(sol.productExceptSelf(new int[]{-1,1,0,-3,3})));
    }
}`
    },
    expectedOutput: {
        javascript: `[24,12,8,6]\n[0,0,9,0,0]`,
        python: `[24, 12, 8, 6]\n[0, 0, 9, 0, 0]`,
        java: `[24, 12, 8, 6]\n[0, 0, 9, 0, 0]`
    }
  },
  "valid-parentheses": {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "String | Stack",
    description: {
      text: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      notes: [
        "An input string is valid if:",
        "Open brackets must be closed by the same type of brackets.",
        "Open brackets must be closed in the correct order.",
        "Every close bracket has a corresponding open bracket of the same type."
      ],
    },
    examples: [
      {
        input: "s = '()'",
        output: "true",
      },
      {
        input: "s = '()[]{}'",
        output: "true",
      },
      {
        input: "s = '(]'",
        output: "false",
      },
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{.}'.",
    ],
    starterCode: {
      javascript: `function isValid(s) {
  // Write your solution here
  
};
`,
      python: `def isValid(s):
    # Write your solution here
    pass`,
      java: `import java.util.*;

class Solution {
    public boolean isValid(String s) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.isValid("()"));
        System.out.println(sol.isValid("()[]{}"));
        System.out.println(sol.isValid("(]"));
    }
}`
    },
    expectedOutput: {
        javascript: `true\ntrue\nfalse`,
        python: `True\nTrue\nFalse`,
        java: `true\ntrue\nfalse`
    }
  },
  "merge-intervals": {
    id: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    category: "Array | Sorting",
    description: {
      text: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
      notes: [],
    },
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6].",
      },
      {
        input: "intervals = [[1,4],[4,5]]",
        output: "[[1,5]]",
        explanation: "Intervals [1,4] and [4,5] are considered overlapping.",
      },
    ],
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= starti <= endi <= 10^4",
    ],
    starterCode: {
      javascript: `function merge(intervals) {
  // Write your solution here
  
};
`,
      python: `def merge(intervals):
    # Write your solution here
    pass`,
      java: `import java.util.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        // Write your solution here
        
        return new int[0][0];
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(Arrays.deepToString(sol.merge(new int[][]{{1,3},{2,6},{8,10},{15,18}})));
        System.out.println(Arrays.deepToString(sol.merge(new int[][]{{1,4},{4,5}})));
    }
}`
    },
    expectedOutput: {
        javascript: `[[1,6],[8,10],[15,18]]\n[[1,5]]`,
        python: `[[1, 6], [8, 10], [15, 18]]\n[[1, 5]]`,
        java: `[[1, 6], [8, 10], [15, 18]]\n[[1, 5]]`
    }
  },
  "group-anagrams": {
    id: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "Medium",
    category: "Array | Hash Table",
    description: {
      text: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
      notes: [
        "An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once."
      ],
    },
    examples: [
      {
        input: "strs = ['eat','tea','tan','ate','nat','bat']",
        output: "[['bat'],['nat','tan'],['ate','eat','tea']]",
      },
      {
        input: "strs = ['']",
        output: "[['']]",
      },
      {
        input: "strs = ['a']",
        output: "[['a']]",
      },
    ],
    constraints: [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100",
      "strs[i] consists of lowercase English letters.",
    ],
    starterCode: {
      javascript: `function groupAnagrams(strs) {
  // Write your solution here
  
};
`,
      python: `def groupAnagrams(strs):
    # Write your solution here
    pass`,
      java: `import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        // Write your solution here
        
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.groupAnagrams(new String[]{"eat","tea","tan","ate","nat","bat"}));
        System.out.println(sol.groupAnagrams(new String[]{""}));
        System.out.println(sol.groupAnagrams(new String[]{"a"}));
    }
}`
    },
    expectedOutput: {
        javascript: `[['bat'],['nat','tan'],['ate','eat','tea']]
[['']]
[['a']]`,
        python: `[['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']]
[['']]
[['a']]`,
        java: `[['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']]
[['']]
[['a']]`
    }
  },
  "number-of-islands": {
    id: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Array | Depth-First Search",
    description: {
      text: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
      notes: [
        "An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water."
      ],
    },
    examples: [
      {
        input: `grid = [
  ['1','1','1','1','0'],
  ['1','1','0','1','0'],
  ['1','1','0','0','0'],
  ['0','0','0','0','0']
]`,
        output: "1",
      },
      {
        input: `grid = [
  ['1','1','0','0','0'],
  ['1','1','0','0','0'],
  ['0','0','1','0','0'],
  ['0','0','0','1','1']
]`,
        output: "3",
      },
    ],
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is '0' or '1'.",
    ],
    starterCode: {
      javascript: `function numIslands(grid) {
  // Write your solution here
  
};
`,
      python: `def numIslands(grid):
    # Write your solution here
    pass`,
      java: `class Solution {
    public int numIslands(char[][] grid) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        char[][] grid1 = {{'1','1','1','1','0'},{'1','1','0','1','0'},{'1','1','0','0','0'},{'0','0','0','0','0'}};
        System.out.println(sol.numIslands(grid1));
        char[][] grid2 = {{'1','1','0','0','0'},{'1','1','0','0','0'},{'0','0','1','0','0'},{'0','0','0','1','1'}};
        System.out.println(sol.numIslands(grid2));
    }
}`
    },
    expectedOutput: {
        javascript: `1\n3`,
        python: `1\n3`,
        java: `1\n3`
    }
  },
  "rotate-image": {
    id: "rotate-image",
    title: "Rotate Image",
    difficulty: "Medium",
    category: "Array",
    description: {
      text: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).",
      notes: [
        "You have to rotate the image in-place, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix and do the rotation."
      ],
    },
    examples: [
      {
        input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        output: "[[7,4,1],[8,5,2],[9,6,3]]",
      },
      {
        input: "matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]",
        output: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]",
      },
    ],
    constraints: [
      "matrix.length == n",
      "matrix[i].length == n",
      "1 <= n <= 20",
      "-1000 <= matrix[i][j] <= 1000",
    ],
    starterCode: {
      javascript: `function rotate(matrix) {
  // Write your solution here
  
};
`,
      python: `def rotate(matrix):
    # Write your solution here
    pass`,
      java: `import java.util.*;

class Solution {
    public void rotate(int[][] matrix) {
        // Write your solution here
        
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        int[][] matrix1 = {{1,2,3},{4,5,6},{7,8,9}};
        sol.rotate(matrix1);
        System.out.println(Arrays.deepToString(matrix1));
        int[][] matrix2 = {{5,1,9,11},{2,4,8,10},{13,3,6,7},{15,14,12,16}};
        sol.rotate(matrix2);
        System.out.println(Arrays.deepToString(matrix2));
    }
}`
    },
    expectedOutput: {
        javascript: `[[7,4,1],[8,5,2],[9,6,3]]\n[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]`,
        python: `[[7, 4, 1], [8, 5, 2], [9, 6, 3]]\n[[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]]`,
        java: `[[7, 4, 1], [8, 5, 2], [9, 6, 3]]\n[[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]]`
    }
  },
  "search-in-rotated-sorted-array": {
    id: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Array | Binary Search",
    description: {
      text: "There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed). For example, [0,1,2,4,5,6,7] might be rotated at pivot index 3 and become [4,5,6,7,0,1,2]. Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.",
      notes: [
        "You must write an algorithm with O(log n) runtime complexity."
      ],
    },
    examples: [
      {
        input: "nums = [4,5,6,7,0,1,2], target = 0",
        output: "4",
      },
      {
        input: "nums = [4,5,6,7,0,1,2], target = 3",
        output: "-1",
      },
      {
        input: "nums = [1], target = 0",
        output: "-1",
      },
    ],
    constraints: [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values of nums are unique.",
      "nums is an ascending array that is possibly rotated.",
      "-10^4 <= target <= 10^4",
    ],
    starterCode: {
      javascript: `function search(nums, target) {
  // Write your solution here
  
};
`,
      python: `def search(nums, target):
    # Write your solution here
    pass`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Write your solution here
        
        return -1;
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.search(new int[]{4,5,6,7,0,1,2}, 0));
        System.out.println(sol.search(new int[]{4,5,6,7,0,1,2}, 3));
        System.out.println(sol.search(new int[]{1}, 0));
    }
}`
    },
    expectedOutput: {
        javascript: `4\n-1\n-1`,
        python: `4\n-1\n-1`,
        java: `4\n-1\n-1`
    }
  },
  "combination-sum": {
    id: "combination-sum",
    title: "Combination Sum",
    difficulty: "Medium",
    category: "Array | Backtracking",
    description: {
      text: "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.",
      notes: [
        "The same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different."
      ],
    },
    examples: [
      {
        input: "candidates = [2,3,6,7], target = 7",
        output: "[[2,2,3],[7]]",
        explanation: "2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times. 7 is a candidate, and 7 = 7. These are the only two combinations.",
      },
      {
        input: "candidates = [2,3,5], target = 8",
        output: "[[2,2,2,2],[2,3,3],[3,5]]",
      },
      {
        input: "candidates = [2], target = 1",
        output: "[]",
      },
    ],
    constraints: [
      "1 <= candidates.length <= 30",
      "1 <= candidates[i] <= 200",
      "All elements of candidates are distinct.",
      "1 <= target <= 500",
    ],
    starterCode: {
      javascript: `function combinationSum(candidates, target) {
  // Write your solution here
  
};
`,
      python: `def combinationSum(candidates, target):
    # Write your solution here
    pass`,
      java: `import java.util.*;

class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        // Write your solution here
        
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.combinationSum(new int[]{2,3,6,7}, 7));
        System.out.println(sol.combinationSum(new int[]{2,3,5}, 8));
        System.out.println(sol.combinationSum(new int[]{2}, 1));
    }
}`
    },
    expectedOutput: {
        javascript: `[[2,2,3],[7]]\n[[2,2,2,2],[2,3,3],[3,5]]\n[]`,
        python: `[[2, 2, 3], [7]]\n[[2, 2, 2, 2], [2, 3, 3], [3, 5]]\n[]`,
        java: `[[2, 2, 3], [7]]\n[[2, 2, 2, 2], [2, 3, 3], [3, 5]]\n[]`
    }
  },
  "trapping-rain-water": {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    category: "Array | Two Pointers",
    description: {
      text: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      notes: [],
    },
    examples: [
      {
        input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6",
        explanation: "The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.",
      },
      {
        input: "height = [4,2,0,3,2,5]",
        output: "9",
      },
    ],
    constraints: [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5",
    ],
    starterCode: {
      javascript: `function trap(height) {
  // Write your solution here
  
};
`,
      python: `def trap(height):
    # Write your solution here
    pass`,
      java: `class Solution {
    public int trap(int[] height) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.trap(new int[]{0,1,0,2,1,0,1,3,2,1,2,1}));
        System.out.println(sol.trap(new int[]{4,2,0,3,2,5}));
    }
}`
    },
    expectedOutput: {
        javascript: `6\n9`,
        python: `6\n9`,
        java: `6\n9`
    }
  },
  "word-ladder": {
    id: "word-ladder",
    title: "Word Ladder",
    difficulty: "Hard",
    category: "String | Breadth-First Search",
    description: {
      text: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that: Every adjacent pair of words differs by a single letter. Every si for 1 <= i <= k is in wordList. Note that beginWord does not need to be in wordList. sk == endWord. Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.",
      notes: [],
    },
    examples: [
      {
        input: "beginWord = 'hit', endWord = 'cog', wordList = ['hot','dot','dog','lot','log','cog']",
        output: "5",
        explanation: "One shortest transformation sequence is 'hit' -> 'hot' -> 'dot' -> 'dog' -> 'cog', which is 5 words long.",
      },
      {
        input: "beginWord = 'hit', endWord = 'cog', wordList = ['hot','dot','dog','lot','log']",
        output: "0",
        explanation: "The endWord 'cog' is not in wordList, therefore no valid transformation sequence exists.",
      },
    ],
    constraints: [
      "1 <= beginWord.length <= 10",
      "endWord.length == beginWord.length",
      "1 <= wordList.length <= 5000",
      "wordList[i].length == beginWord.length",
      "beginWord, endWord, and wordList[i] consist of lowercase English letters.",
      "beginWord != endWord",
      "All the words in wordList are unique.",
    ],
    starterCode: {
      javascript: `function ladderLength(beginWord, endWord, wordList) {
  // Write your solution here
  
};
`,
      python: `def ladderLength(beginWord, endWord, wordList):
    # Write your solution here
    pass`,
      java: `import java.util.*;

class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.ladderLength("hit", "cog", Arrays.asList("hot","dot","dog","lot","log","cog")));
        System.out.println(sol.ladderLength("hit", "cog", Arrays.asList("hot","dot","dog","lot","log")));
    }
}`
    },
    expectedOutput: {
        javascript: `5\n0`,
        python: `5\n0`,
        java: `5\n0`
    }
  },
  "median-of-two-sorted-arrays": {
    id: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Array | Binary Search",
    description: {
      text: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
      notes: [
        "The overall run time complexity should be O(log (m+n))."
      ],
    },
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000",
        explanation: "merged array = [1,2,3] and median is 2.",
      },
      {
        input: "nums1 = [1,2], nums2 = [3,4]",
        output: "2.50000",
        explanation: "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.",
      },
    ],
    constraints: [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m <= 1000",
      "0 <= n <= 1000",
      "1 <= m + n <= 2000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6",
    ],
    starterCode: {
      javascript: `function findMedianSortedArrays(nums1, nums2) {
  // Write your solution here
  
};
`,
      python: `def findMedianSortedArrays(nums1, nums2):
    # Write your solution here
    pass`,
      java: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Write your solution here
        
        return 0.0;
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.findMedianSortedArrays(new int[]{1,3}, new int[]{2}));
        System.out.println(sol.findMedianSortedArrays(new int[]{1,2}, new int[]{3,4}));
    }
}`
    },
    expectedOutput: {
        javascript: `2.00000\n2.50000`,
        python: `2.0\n2.5`,
        java: `2.0\n2.5`
    }
  },
  "regular-expression-matching": {
    id: "regular-expression-matching",
    title: "Regular Expression Matching",
    difficulty: "Hard",
    category: "String | Dynamic Programming",
    description: {
      text: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where: '.' Matches any single character. '*' Matches zero or more of the preceding element.",
      notes: [
        "The matching should cover the entire input string (not partial)."
      ],
    },
    examples: [
      {
        input: "s = 'aa', p = 'a'",
        output: "false",
        explanation: "'a' does not match the entire string 'aa'.",
      },
      {
        input: "s = 'aa', p = 'a*'",
        output: "true",
        explanation: "'*' means zero or more of the preceding element, 'a'. Therefore, by repeating 'a' once, it becomes 'aa'.",
      },
      {
        input: "s = 'ab', p = '.*'",
        output: "true",
        explanation: "'.*' means 'zero or more of any character'.",
      },
    ],
    constraints: [
      "1 <= s.length <= 20",
      "1 <= p.length <= 30",
      "s contains only lowercase English letters.",
      "p contains only lowercase English letters, '.', and '*'.",
      "It is guaranteed for each appearance of the character '*', there will be a previous valid character to match.",
    ],
    starterCode: {
      javascript: `function isMatch(s, p) {
  // Write your solution here
  
};
`,
      python: `def isMatch(s, p):
    # Write your solution here
    pass`,
      java: `class Solution {
    public boolean isMatch(String s, String p) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.isMatch("aa", "a"));
        System.out.println(sol.isMatch("aa", "a*"));
        System.out.println(sol.isMatch("ab", ".*"));
    }
}`
    },
    expectedOutput: {
        javascript: `false\ntrue\ntrue`,
        python: `False\nTrue\nTrue`,
        java: `false\ntrue\ntrue`
    }
  },
  "merge-k-sorted-lists": {
    id: "merge-k-sorted-lists",
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    category: "Linked List | Priority Queue",
    description: {
      text: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
      notes: [],
    },
    examples: [
      {
        input: "lists = [[1,4,5],[1,3,4],[2,6]]",
        output: "[1,1,2,3,4,4,5,6]",
      },
      {
        input: "lists = []",
        output: "[]",
      },
      {
        input: "lists = [[]]",
        output: "[]",
      },
    ],
    constraints: [
      "k == lists.length",
      "0 <= k <= 10^4",
      "0 <= lists[i].length <= 500",
      "-10^4 <= lists[i][j] <= 10^4",
      "lists[i] is sorted in ascending order.",
      "The sum of lists[i].length will not exceed 10^4.",
    ],
    starterCode: {
      javascript: `function mergeKLists(lists) {
  // Write your solution here
  
};
`,
      python: `def mergeKLists(lists):
    # Write your solution here
    pass`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        // Write your solution here
        
        return null;
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        // Create test lists
        ListNode l1 = new ListNode(1, new ListNode(4, new ListNode(5)));
        ListNode l2 = new ListNode(1, new ListNode(3, new ListNode(4)));
        ListNode l3 = new ListNode(2, new ListNode(6));
        ListNode result = sol.mergeKLists(new ListNode[]{l1, l2, l3});
        // Print result
        StringBuilder sb = new StringBuilder("[");
        while (result != null) {
            sb.append(result.val);
            if (result.next != null) sb.append(",");
            result = result.next;
        }
        sb.append("]");
        System.out.println(sb.toString());
        System.out.println("[]");
        System.out.println("[]");
    }
}`
    },
    expectedOutput: {
        javascript: `[1,1,2,3,4,4,5,6]\n[]\n[]`,
        python: `[1, 1, 2, 3, 4, 4, 5, 6]\n[]\n[]`,
        java: `[1, 1, 2, 3, 4, 4, 5, 6]\n[]\n[]`
    }
  },
  "longest-valid-parentheses": {
    id: "longest-valid-parentheses",
    title: "Longest Valid Parentheses",
    difficulty: "Hard",
    category: "String | Dynamic Programming",
    description: {
      text: "Given a string containing just the characters '(' and ')', find the length of the longest valid (well-formed) parentheses substring.",
      notes: [],
    },
    examples: [
      {
        input: "s = '(()'",
        output: "2",
        explanation: "The longest valid parentheses substring is '()'.",
      },
      {
        input: "s = ')()())'",
        output: "4",
        explanation: "The longest valid parentheses substring is '()()'.",
      },
      {
        input: "s = ''",
        output: "0",
      },
    ],
    constraints: [
      "0 <= s.length <= 3 * 10^4",
      "s[i] is '(' or ')'.",
    ],
    starterCode: {
      javascript: `function longestValidParentheses(s) {
  // Write your solution here
  
};
`,
      python: `def longestValidParentheses(s):
    # Write your solution here
    pass`,
      java: `class Solution {
    public int longestValidParentheses(String s) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.longestValidParentheses("(()"));
        System.out.println(sol.longestValidParentheses(")()())"));
        System.out.println(sol.longestValidParentheses(""));
    }
}`
    },
    expectedOutput: {
        javascript: `2\n4\n0`,
        python: `2\n4\n0`,
        java: `2\n4\n0`
    }
  },
  "n-queens": {
    id: "n-queens",
    title: "N-Queens",
    difficulty: "Hard",
    category: "Backtracking",
    description: {
      text: "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.",
      notes: [
        "Each solution contains a distinct board configuration of the n-queens' placement, where 'Q' and '.' both indicate a queen and an empty space, respectively."
      ],
    },
    examples: [
      {
        input: "n = 4",
        output: "[[..Q., Q... , ...Q, .Q..], [.Q.., ...Q, Q..., ..Q.]]",
        explanation: "There are two distinct solutions to the 4-queens puzzle as shown.",
      },
      {
        input: "n = 1",
        output: "[[Q]]",
      },
    ],
    constraints: [
      "1 <= n <= 9",
    ],
    starterCode: {
      javascript: `function solveNQueens(n) {
  // Write your solution here
  
};
`,
      python: `def solveNQueens(n):
    # Write your solution here
    pass`,
      java: `import java.util.*;

class Solution {
    public List<List<String>> solveNQueens(int n) {
        // Write your solution here
        
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.solveNQueens(4));
        System.out.println(sol.solveNQueens(1));
    }
}`
    },
    expectedOutput: {
        javascript: `[[ ".Q..", "...Q", "Q...", "..Q."], [ "..Q.", "...Q", "Q...", ".Q.." ]]`,
        python: `[['.Q..', '...Q', 'Q...', '..Q.'], ['..Q.', 'Q...', '...Q', '.Q..']]`,
        java: `[[.Q.., ...Q, Q..., ..Q.], [..Q., Q..., ...Q, .Q..]]`
    }
  },
  "sudoku-solver": {
    id: "sudoku-solver",
    title: "Sudoku Solver",
    difficulty: "Hard",
    category: "Backtracking",
    description: {
      text: "Write a program to solve a Sudoku puzzle by filling the empty cells.",
      notes: [
        "A sudoku solution must satisfy all of the following rules:",
        "Each of the digits 1-9 must occur exactly once in each row.",
        "Each of the digits 1-9 must occur exactly once in each column.",
        "Each of the digits 1-9 must occur exactly once in each of the 9 3x3 sub-boxes of the grid.",
        "The '.' character indicates empty cells."
      ],
    },
    examples: [
      {
        input: `board = [["5","3",".",".","7",".",".",".",""],["6",".",".","1","9","5",".","."],[ ".","9","8",".",".",".",".","6",""],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[ ".","6",".",".",".",".","2","8",""],[ ".",".",".","4","1","9",".",".","5"],[ ".",".",".",".","8",".",".","7","9"]]`,
        output: `[[ "5", "3", "4", "6", "7", "8", "9", "1", "2" ], [ "6", "7", "2", "1", "9", "5", "3", "4", "8" ], [ "1", "9", "8", "3", "4", "2", "5", "6", "7" ], [ "8", "5", "9", "7", "6", "1", "4", "2", "3" ], [ "4", "2", "6", "8", "5", "3", "7", "9", "1" ], [ "7", "1", "3", "9", "2", "4", "8", "5", "6" ], [ "9", "6", "1", "5", "3", "7", "2", "8", "4" ], [ "2", "8", "7", "4", "1", "9", "6", "3", "5" ], [ "3", "4", "5", "2", "8", "6", "1", "7", "9" ]]`,
      },
    ],
    constraints: [
      "board.length == 9",
      "board[i].length == 9",
      "board[i][j] is a digit or '.'",
      "It is guaranteed that the input board has only one solution.",
    ],
    starterCode: {
      javascript: `function solveSudoku(board) {
  // Write your solution here
  
};
`,
      python: `def solveSudoku(board):
    # Write your solution here
    pass`,
      java: `import java.util.*;

class Solution {
    public void solveSudoku(char[][] board) {
        // Write your solution here
        
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        char[][] board = {
            {'5','3','.','.','7','.','.','.','.'},
            {'6','.','.','1','9','5','.','.','.'},
            {'.','9','8','.','.','.','.','6','.'},
            {'8','.','.','.','6','.','.','.','3'},
            {'4','.','.','8','.','3','.','.','1'},
            {'7','.','.','.','2','.','.','.','6'},
            {'.','6','.','.','.','.','2','8','.'},
            {'.','.','.','4','1','9','.','.','5'},
            {'.','.','.','.','8','.','.','7','9'}
        };
        sol.solveSudoku(board);
        System.out.println(Arrays.deepToString(board));
    }
}`
    },
    expectedOutput: {
        javascript: `[[ "5", "3", "4", "6", "7", "8", "9", "1", "2" ], [ "6", "7", "2", "1", "9", "5", "3", "4", "8" ], [ "1", "9", "8", "3", "4", "2", "5", "6", "7" ], [ "8", "5", "9", "7", "6", "1", "4", "2", "3" ], [ "4", "2", "6", "8", "5", "3", "7", "9", "1" ], [ "7", "1", "3", "9", "2", "4", "8", "5", "6" ], [ "9", "6", "1", "5", "3", "7", "2", "8", "4" ], [ "2", "8", "7", "4", "1", "9", "6", "3", "5" ], [ "3", "4", "5", "2", "8", "6", "1", "7", "9" ]]`,
        python: `[['5', '3', '4', '6', '7', '8', '9', '1', '2'], ['6', '7', '2', '1', '9', '5', '3', '4', '8'], ['1', '9', '8', '3', '4', '2', '5', '6', '7'], ['8', '5', '9', '7', '6', '1', '4', '2', '3'], ['4', '2', '6', '8', '5', '3', '7', '9', '1'], ['7', '1', '3', '9', '2', '4', '8', '5', '6'], ['9', '6', '1', '5', '3', '7', '2', '8', '4'], ['2', '8', '7', '4', '1', '9', '6', '3', '5'], ['3', '4', '5', '2', '8', '6', '1', '7', '9']]`,
        java: `[['5', '3', '4', '6', '7', '8', '9', '1', '2'], ['6', '7', '2', '1', '9', '5', '3', '4', '8'], ['1', '9', '8', '3', '4', '2', '5', '6', '7'], ['8', '5', '9', '7', '6', '1', '4', '2', '3'], ['4', '2', '6', '8', '5', '3', '7', '9', '1'], ['7', '1', '3', '9', '2', '4', '8', '5', '6'], ['9', '6', '1', '5', '3', '7', '2', '8', '4'], ['2', '8', '7', '4', '1', '9', '6', '3', '5'], ['3', '4', '5', '2', '8', '6', '1', '7', '9']]`
    }
  },
  "largest-rectangle-in-histogram": {
    id: "largest-rectangle-in-histogram",
    title: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    category: "Array | Stack",
    description: {
      text: "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
      notes: [],
    },
    examples: [
      {
        input: "heights = [2,1,5,6,2,3]",
        output: "10",
        explanation: "The largest rectangle is shown in the red area, which has an area of 10 units.",
      },
      {
        input: "heights = [2,4]",
        output: "4",
      },
    ],
    constraints: [
      "1 <= heights.length <= 10^5",
      "0 <= heights[i] <= 10^4",
    ],
    starterCode: {
      javascript: `function largestRectangleArea(heights) {
  // Write your solution here
  
};
`,
      python: `def largestRectangleArea(heights):
    # Write your solution here
    pass`,
      java: `class Solution {
    public int largestRectangleArea(int[] heights) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.largestRectangleArea(new int[]{2,1,5,6,2,3}));
        System.out.println(sol.largestRectangleArea(new int[]{2,4}));
    }
}`
    },
    expectedOutput: {
        javascript: `10\n4`,
        python: `10\n4`,
        java: `10\n4`
    }
  },
  "edit-distance": {
    id: "edit-distance",
    title: "Edit Distance",
    difficulty: "Hard",
    category: "String | Dynamic Programming",
    description: {
      text: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.",
      notes: [
        "You have the following three operations permitted on a word:",
        "Insert a character",
        "Delete a character",
        "Replace a character"
      ],
    },
    examples: [
      {
        input: "word1 = 'horse', word2 = 'ros'",
        output: "3",
        explanation: "horse -> rorse (replace 'h' with 'r')\nrorse -> rose (remove 'r')\nrose -> ros (remove 'e')",
      },
      {
        input: "word1 = 'intention', word2 = 'execution'",
        output: "5",
        explanation: "intention -> inention (remove 't')\ninention -> enention (replace 'i' with 'e')\nenention -> exention (replace 'n' with 'x')\nexention -> exection (replace 'n' with 'c')\nexection -> execution (insert 'u')",
      },
    ],
    constraints: [
      "0 <= word1.length, word2.length <= 500",
      "word1 and word2 consist of lowercase English letters.",
    ],
    starterCode: {
      javascript: `function minDistance(word1, word2) {
  // Write your solution here
  
};
`,
      python: `def minDistance(word1, word2):
    # Write your solution here
    pass`,
      java: `class Solution {
    public int minDistance(String word1, String word2) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.minDistance("horse", "ros"));
        System.out.println(sol.minDistance("intention", "execution"));
    }
}`
    },
    expectedOutput: {
        javascript: `3\n5`,
        python: `3\n5`,
        java: `3\n5`
    }
  }
};

export const LANGUAGE_CONFIG = {
  javascript: {
    name: "JavaScript",
    icon: "/javascript.png",
    monacoLang: "javascript",
  },
  python: {
    name: "Python",
    icon: "/python.png",
    monacoLang: "python",
  },
  java: {
    name: "Java",
    icon: "/java.png",
    monacoLang: "java",
  },
};
