import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class LocationBroadcastCard extends StatelessWidget {
  const LocationBroadcastCard({
    super.key,
    required this.lat,
    required this.lng,
    required this.isTracking,
  });

  final double? lat;
  final double? lng;
  final bool isTracking;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(14.w),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1F2E),
        borderRadius: BorderRadius.circular(16.r),
        border: Border.all(
          color: isTracking
              ? const Color(0xFF00D9A5).withOpacity(0.4)
              : const Color(0xFF2A3142),
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.all(10.w),
            decoration: BoxDecoration(
              color: const Color(0xFF00D9A5).withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.my_location,
              color: const Color(0xFF00D9A5),
              size: 20.sp,
            ),
          ),
          SizedBox(width: 12.w),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      'Your Location Broadcasting',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 13.sp,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    SizedBox(width: 6.w),
                    if (isTracking)
                      Container(
                        width: 7.w,
                        height: 7.h,
                        decoration: const BoxDecoration(
                          color: Color(0xFF00D9A5),
                          shape: BoxShape.circle,
                        ),
                      ),
                  ],
                ),
                SizedBox(height: 4.h),
                if (lat != null && lng != null)
                  Text(
                    '${lat!.toStringAsFixed(5)}, ${lng!.toStringAsFixed(5)}',
                    style: TextStyle(
                      color: Colors.white38,
                      fontSize: 11.sp,
                      fontFamily: 'monospace',
                    ),
                  )
                else
                  Text(
                    'Acquiring location...',
                    style: TextStyle(color: Colors.white38, fontSize: 11.sp),
                  ),
              ],
            ),
          ),
          if (isTracking)
            SizedBox(
              width: 16.w,
              height: 16.h,
              child: const CircularProgressIndicator(
                strokeWidth: 2,
                color: Color(0xFF00D9A5),
              ),
            ),
        ],
      ),
    );
  }
}
