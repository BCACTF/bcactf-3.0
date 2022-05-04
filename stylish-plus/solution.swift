import Foundation

Task {
    CFRunLoopStop(CFRunLoopGetCurrent())
}

CFRunLoopRun()