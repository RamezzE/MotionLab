#!/usr/bin/env python
"""
MotionLab Test Runner with Visualizations

This script runs all the test cases for the MotionLab application
and generates visualizations for presenting the results to a committee.
"""

import os
import sys
import unittest
import time
import argparse
import matplotlib.pyplot as plt
from datetime import datetime

# Add the parent directory to the path so we can import from services
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.visualization import TestVisualizer

def run_test_with_visuals(test_module, test_case=None, test_method=None):
    """
    Run a specific test with visualizations
    
    Args:
        test_module: Name of the test module to run (e.g., 'test_keypoint_extraction')
        test_case: Optional name of test case class to run
        test_method: Optional name of test method to run
        
    Returns:
        Tuple of (result, test_count, success_count)
    """
    # Import the module
    __import__(test_module)
    module = sys.modules[test_module]
    
    # Create a test suite
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    if test_case:
        test_case_class = getattr(module, test_case)
        if test_method:
            suite.addTest(test_case_class(test_method))
        else:
            suite.addTest(loader.loadTestsFromTestCase(test_case_class))
    else:
        suite.addTest(loader.loadTestsFromModule(module))
    
    # Run the tests
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    
    # Return the result and counts
    return result, result.testsRun, result.testsRun - len(result.errors) - len(result.failures)

def create_summary_report(results, visualizer):
    """
    Create a summary report of all test results
    
    Args:
        results: Dictionary of test results
        visualizer: TestVisualizer instance
    """
    # Create a figure
    fig, ax = plt.subplots(figsize=(12, 8))
    
    # Set title
    fig.suptitle("MotionLab Test Report Summary", fontsize=18, fontweight='bold')
    
    # Prepare data
    test_names = list(results.keys())
    pass_counts = []
    fail_counts = []
    total_counts = []
    
    for test_name in test_names:
        result = results[test_name]
        pass_counts.append(result['success_count'])
        fail_counts.append(result['test_count'] - result['success_count'])
        total_counts.append(result['test_count'])
    
    # Set up the bar chart
    x = range(len(test_names))
    width = 0.35
    
    # Create bars
    ax.bar(x, pass_counts, width, label='Passed', color='green')
    ax.bar(x, fail_counts, width, bottom=pass_counts, label='Failed', color='red')
    
    # Add text on top of bars
    for i, (total, passed) in enumerate(zip(total_counts, pass_counts)):
        percentage = (passed / total) * 100 if total > 0 else 0
        ax.text(i, total + 0.1, f"{percentage:.1f}%", ha='center', fontweight='bold')
    
    # Customize the plot
    ax.set_ylabel('Number of Tests', fontsize=14)
    ax.set_xlabel('Test Cases', fontsize=14)
    ax.set_xticks(x)
    ax.set_xticklabels(test_names)
    ax.legend()
    
    # Add timestamp
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    plt.figtext(0.5, 0.01, f"Generated on {timestamp}", ha='center', fontsize=12)
    
    # Save the summary report
    filename = f"test_summary_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
    filepath = os.path.join(visualizer.output_dir, filename)
    plt.savefig(filepath, dpi=150, bbox_inches='tight')
    print(f"Summary report saved to {filepath}")
    
    return filepath

def main():
    """Main entry point for the test runner with visualizations"""
    parser = argparse.ArgumentParser(description="Run MotionLab tests with visualizations")
    parser.add_argument('--module', help="Specific test module to run")
    parser.add_argument('--case', help="Specific test case class to run")
    parser.add_argument('--method', help="Specific test method to run")
    parser.add_argument('--output-dir', help="Directory to save visualizations")
    args = parser.parse_args()
    
    # Create the test visualizer
    visualizer = TestVisualizer(output_dir=args.output_dir)
    
    # Print information about the test run
    print("=" * 80)
    print("MOTIONLAB TEST RUNNER WITH VISUALIZATIONS")
    print("=" * 80)
    print(f"Visualization output directory: {visualizer.output_dir}")
    print("-" * 80)
    
    start_time = time.time()
    
    # Determine which tests to run
    if args.module:
        # Run specific test module/case/method
        print(f"Running specific test: {args.module}")
        result, test_count, success_count = run_test_with_visuals(
            args.module, args.case, args.method
        )
        
        # Store results
        results = {
            args.module: {
                'result': result,
                'test_count': test_count,
                'success_count': success_count
            }
        }
    else:
        # Run all test files in the directory
        results = {}
        test_files = [f[:-3] for f in os.listdir(os.path.dirname(__file__)) 
                    if f.startswith('test_') and f.endswith('.py')]
        
        print(f"Running all {len(test_files)} test modules:")
        for test_file in test_files:
            print(f"  - {test_file}")
            result, test_count, success_count = run_test_with_visuals(test_file)
            
            # Store results
            results[test_file] = {
                'result': result,
                'test_count': test_count,
                'success_count': success_count
            }
    
    # Calculate overall statistics
    total_tests = sum(result['test_count'] for result in results.values())
    total_success = sum(result['success_count'] for result in results.values())
    success_rate = (total_success / total_tests) * 100 if total_tests > 0 else 0
    
    end_time = time.time()
    duration = end_time - start_time
    
    # Create summary report
    summary_filepath = create_summary_report(results, visualizer)
    
    # Print summary
    print("\n" + "=" * 80)
    print(f"TEST SUMMARY: {total_success}/{total_tests} tests passed ({success_rate:.1f}%)")
    print(f"Duration: {duration:.2f} seconds")
    print(f"Summary report: {summary_filepath}")
    print("=" * 80)
    
    # Return appropriate exit code based on test results
    return 0 if total_success == total_tests else 1

if __name__ == '__main__':
    sys.exit(main()) 