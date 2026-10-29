# iOS native client

Native SwiftUI application using MapKit for the initial map surface. This is a starter shell; it does not yet implement authentication, cloud persistence, chat transport or production location handling.

Open `MeetCloud.xcodeproj` in Xcode on macOS. Select the `MeetCloud` scheme and an iOS 17+ simulator/device. Set a unique bundle identifier and configure signing in Xcode before running on a physical device.

The initial UI is deliberately explicit that map data and cloud publication are not connected yet. No fake people or fabricated location markers are shown.
