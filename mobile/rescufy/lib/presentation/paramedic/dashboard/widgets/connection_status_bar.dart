import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rescufy/presentation/paramedic/dashboard/cubit/dashboard_state.dart';

class ConnectionStatusBar extends StatelessWidget {
  const ConnectionStatusBar({super.key, required this.status});
  final DashboardSignalRStatus status;

  @override
  Widget build(BuildContext context) {
    if (status == DashboardSignalRStatus.connected)
      return const SizedBox.shrink();

    final (label, color) = switch (status) {
      DashboardSignalRStatus.connecting => (
        'Connecting to server...',
        const Color(0xFFF59E0B),
      ),
      DashboardSignalRStatus.reconnecting => (
        'Reconnecting...',
        const Color(0xFFF59E0B),
      ),
      DashboardSignalRStatus.disconnected => (
        'Disconnected from server',
        const Color(0xFFDC2626),
      ),
      _ => ('', Colors.transparent),
    };

    return Container(
      color: color.withOpacity(0.12),
      padding: EdgeInsets.symmetric(vertical: 6.h, horizontal: 20.w),
      child: Row(
        children: [
          SizedBox(
            width: 12.w,
            height: 12.h,
            child: CircularProgressIndicator(strokeWidth: 2, color: color),
          ),
          SizedBox(width: 8.w),
          Text(
            label,
            style: TextStyle(color: color, fontSize: 12.sp),
          ),
        ],
      ),
    );
  }
}
