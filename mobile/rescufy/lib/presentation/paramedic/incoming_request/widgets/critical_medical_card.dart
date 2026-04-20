import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rescufy/domain/entities/incoming_request.dart';

/// Highlights allergies and chronic diseases — critical for paramedic decisions.
class CriticalMedicalCard extends StatelessWidget {
  const CriticalMedicalCard({super.key, required this.request});
  final IncomingRequest request;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: const Color(0xFF2D1515),
        borderRadius: BorderRadius.circular(16.r),
        border: Border.all(color: const Color(0xFFDC2626).withOpacity(0.4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.warning_amber_rounded,
                color: const Color(0xFFDC2626),
                size: 20.sp,
              ),
              SizedBox(width: 8.w),
              Text(
                'Critical Medical Data',
                style: TextStyle(
                  color: const Color(0xFFDC2626),
                  fontSize: 14.sp,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          SizedBox(height: 14.h),
          if (request.allergies.isNotEmpty) ...[
            _section('Allergies', request.allergies, const Color(0xFFDC2626)),
            SizedBox(height: 10.h),
          ],
          if (request.chronicDiseases.isNotEmpty)
            _section(
              'Chronic Diseases',
              request.chronicDiseases,
              const Color(0xFFF59E0B),
            ),
          if (request.currentMedications.isNotEmpty) ...[
            SizedBox(height: 10.h),
            _section(
              'Current Medications',
              request.currentMedications,
              const Color(0xFF00A8E8),
            ),
          ],
        ],
      ),
    );
  }

  Widget _section(String label, List<String> items, Color chipColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(color: Colors.white54, fontSize: 12.sp),
        ),
        SizedBox(height: 6.h),
        Wrap(
          spacing: 8.w,
          runSpacing: 6.h,
          children: items
              .map(
                (item) => Container(
                  padding: EdgeInsets.symmetric(
                    horizontal: 10.w,
                    vertical: 5.h,
                  ),
                  decoration: BoxDecoration(
                    color: chipColor.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(20.r),
                    border: Border.all(color: chipColor.withOpacity(0.5)),
                  ),
                  child: Text(
                    item,
                    style: TextStyle(
                      color: chipColor,
                      fontSize: 12.sp,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              )
              .toList(),
        ),
      ],
    );
  }
}
