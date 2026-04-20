import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class WaitingStateWidget extends StatelessWidget {
  const WaitingStateWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 100.w,
            height: 100.h,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: const Color(0xFF1A1F2E),
              border: Border.all(color: const Color(0xFF2A3142), width: 2),
            ),
            child: Icon(
              Icons.notifications_none,
              size: 48.sp,
              color: const Color(0xFF4A5568),
            ),
          ),
          SizedBox(height: 20.h),
          Text(
            'Waiting for emergency requests',
            style: TextStyle(color: Colors.white70, fontSize: 16.sp),
          ),
          SizedBox(height: 8.h),
          Text(
            'Stay online to receive assignments',
            style: TextStyle(color: Colors.white38, fontSize: 13.sp),
          ),
        ],
      ),
    );
  }
}
