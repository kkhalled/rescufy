import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rescufy/domain/entities/case_status.dart';

class StatusStepper extends StatelessWidget {
  const StatusStepper({super.key, required this.currentStatus});
  final CaseStatus currentStatus;

  static const _steps = [
    CaseStatus.pending,
    CaseStatus.onTheWay,
    CaseStatus.arrived,
    CaseStatus.completed,
  ];

  @override
  Widget build(BuildContext context) {
    final currentIndex = _steps.indexOf(currentStatus);

    return Container(
      color: const Color(0xFF1A1F2E),
      padding: EdgeInsets.symmetric(horizontal: 20.w, vertical: 14.h),
      child: Row(
        children: List.generate(_steps.length * 2 - 1, (i) {
          if (i.isOdd) {
            final stepIndex = i ~/ 2;
            final isDone = stepIndex < currentIndex;
            return Expanded(
              child: Container(
                height: 2,
                color: isDone
                    ? const Color(0xFF00D9A5)
                    : const Color(0xFF2A3142),
              ),
            );
          }
          final stepIndex = i ~/ 2;
          final isDone = stepIndex <= currentIndex;
          final isCurrent = stepIndex == currentIndex;
          final color = isDone
              ? const Color(0xFF00D9A5)
              : const Color(0xFF2A3142);

          return Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 28.w,
                height: 28.h,
                decoration: BoxDecoration(
                  color: isDone ? color : Colors.transparent,
                  shape: BoxShape.circle,
                  border: Border.all(color: color, width: isCurrent ? 2 : 1),
                ),
                child: isDone
                    ? Icon(Icons.check, color: Colors.white, size: 14.sp)
                    : null,
              ),
              SizedBox(height: 4.h),
              Text(
                _steps[stepIndex].label,
                style: TextStyle(
                  color: isDone ? const Color(0xFF00D9A5) : Colors.white38,
                  fontSize: 9.sp,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          );
        }),
      ),
    );
  }
}
