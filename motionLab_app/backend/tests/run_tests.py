"""
Test runner for MotionLab application.
Runs all the test cases for the motion capture functionality.
"""

import unittest
import os
import sys

# Add parent directory to the path so we can import test modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

def run_all_tests():
    """Run all the test cases"""
    # Discover and run all tests in the tests directory
    test_loader = unittest.TestLoader()
    test_suite = test_loader.discover(os.path.dirname(__file__), pattern="test_*.py")
    
    # Create a test runner
    test_runner = unittest.TextTestRunner(verbosity=2)
    
    # Run the tests
    print("\n=== Running MotionLab Test Suite ===\n")
    result = test_runner.run(test_suite)
    
    # Print summary
    print("\n=== Test Suite Execution Complete ===")
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Skipped: {len(result.skipped)}")
    
    # Return code based on test success
    return 0 if result.wasSuccessful() else 1

def run_specific_test(test_module, test_case=None, test_method=None):
    """
    Run a specific test module, case, or method
    
    Args:
        test_module: Name of the test module (e.g., "test_keypoint_extraction")
        test_case: Name of the test case class (optional)
        test_method: Name of the specific test method (optional)
    """
    if test_method and test_case:
        # Run a specific test method
        suite = unittest.TestSuite()
        suite.addTest(getattr(getattr(sys.modules[test_module], test_case), test_method))
    elif test_case:
        # Run all test methods in a specific test case
        suite = unittest.TestLoader().loadTestsFromTestCase(getattr(sys.modules[test_module], test_case))
    else:
        # Run all test cases in a specific module
        suite = unittest.TestLoader().loadTestsFromName(test_module)
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return 0 if result.wasSuccessful() else 1

if __name__ == "__main__":
    # Check if specific tests are requested
    if len(sys.argv) > 1:
        # Import the requested test module
        test_module_name = sys.argv[1]
        try:
            exec(f"import {test_module_name}")
            
            # Check if a specific test case is requested
            test_case_name = sys.argv[2] if len(sys.argv) > 2 else None
            
            # Check if a specific test method is requested
            test_method_name = sys.argv[3] if len(sys.argv) > 3 else None
            
            # Run the requested tests
            sys.exit(run_specific_test(test_module_name, test_case_name, test_method_name))
        except ImportError:
            print(f"Error: Test module '{test_module_name}' not found.")
            sys.exit(1)
    else:
        # Run all tests
        sys.exit(run_all_tests()) 