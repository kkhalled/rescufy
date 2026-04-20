import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rescufy/domain/entities/incoming_request.dart';

class CaseInfoCard extends StatelessWidget {
  const CaseInfoCard({super.key, required this.request});
  final IncomingRequest request;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1F2E),
        borderRadius: BorderRadius.circular(16.r),
        border: Border.all(color: const Color(0xFF2A3142)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.medical_services,
                color: const Color(0xFFDC2626),
                size: 18.sp,
              ),
              SizedBox(width: 8.w),
              Text(
                'Patient Info',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 15.sp,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          SizedBox(height: 12.h),
          _row('Name', request.patientName),
          _row('Age', '${request.patientAge} yrs • ${request.patientGender}'),
          _row('Emergency', request.emergencyType),
          _row(
            'Severity',
            request.severity.toUpperCase(),
            valueColor: request.isCritical
                ? const Color(0xFFDC2626)
                : const Color(0xFFF59E0B),
          ),
          _row('Hospital', request.hospitalName),
          if (request.hasCriticalMedicalData) ...[
            SizedBox(height: 10.h),
            Container(
              padding: EdgeInsets.all(10.w),
              decoration: BoxDecoration(
                color: const Color(0xFFDC2626).withOpacity(0.08),
                borderRadius: BorderRadius.circular(10.r),
                border: Border.all(
                  color: const Color(0xFFDC2626).withOpacity(0.3),
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.warning_amber_rounded,
                    color: const Color(0xFFDC2626),
                    size: 14.sp,
                  ),
                  SizedBox(width: 6.w),
                  Expanded(
                    child: Text(
                      request.allergies.isNotEmpty
                          ? 'Allergies: ${request.allergies.join(", ")}'
                          : 'Chronic: ${request.chronicDiseases.join(", ")}',
                      style: TextStyle(
                        color: const Color(0xFFDC2626),
                        fontSize: 12.sp,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _row(String label, String value, {Color? valueColor}) => Padding(
    padding: EdgeInsets.only(bottom: 8.h),
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(color: Colors.white54, fontSize: 13.sp),
        ),
        Text(
          value,
          style: TextStyle(
            color: valueColor ?? Colors.white,
            fontSize: 13.sp,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    ),
  );
}
