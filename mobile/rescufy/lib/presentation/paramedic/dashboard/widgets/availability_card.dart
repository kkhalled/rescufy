// lib/presentation/paramedic/dashboard/widgets/availability_card.dart
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rescufy/core/theme/app_text_styles.dart';

class AvailabilityCard extends StatelessWidget {
  const AvailabilityCard({
    super.key,
    required this.isOnline,
    required this.onToggle,
  });

  final bool isOnline;
  final VoidCallback onToggle;

  @override
  Widget build(BuildContext context) {
    final statusColor = isOnline ? const Color(0xFF00D9A5) : Colors.white38;

    return Container(
      margin: EdgeInsets.symmetric(horizontal: 20.w),
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1F2E),
        borderRadius: BorderRadius.circular(16.r),
        border: Border.all(color: const Color(0xFF2A3142)),
      ),
      child: Row(
        children: [
          _StatusDot(isOnline: isOnline, color: statusColor),
          SizedBox(width: 12.w),
          _StatusLabel(isOnline: isOnline),
          const Spacer(),
          _StatusBadge(isOnline: isOnline, color: statusColor),
          SizedBox(width: 12.w),
          Switch(
            value: isOnline,
            onChanged: (_) => onToggle(),
            activeColor: const Color(0xFF00D9A5),
            inactiveThumbColor: Colors.white38,
            inactiveTrackColor: const Color(0xFF2A3142),
          ),
        ],
      ),
    );
  }
}

class _StatusDot extends StatelessWidget {
  const _StatusDot({required this.isOnline, required this.color});

  final bool isOnline;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 10.w,
      height: 10.h,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        boxShadow: isOnline
            ? [BoxShadow(color: color.withOpacity(0.5), blurRadius: 8)]
            : null,
      ),
    );
  }
}

class _StatusLabel extends StatelessWidget {
  const _StatusLabel({required this.isOnline});

  final bool isOnline;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          isOnline ? 'You are Online' : 'You are Offline',
          style: AppTextStyles.labelLarge(Colors.white),
        ),
        SizedBox(height: 2.h),
        Text(
          isOnline ? 'Ready to receive requests' : 'Toggle to go online',
          style: AppTextStyles.bodySmall(Colors.white54),
        ),
      ],
    );
  }
}

class _StatusBadge extends StatelessWidget {
  const _StatusBadge({required this.isOnline, required this.color});

  final bool isOnline;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 6.h),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20.r),
        border: Border.all(color: color.withOpacity(0.5)),
      ),
      child: Text(
        isOnline ? 'ONLINE' : 'OFFLINE',
        style: TextStyle(
          color: color,
          fontSize: 11.sp,
          fontWeight: FontWeight.bold,
          letterSpacing: 1,
        ),
      ),
    );
  }
}
