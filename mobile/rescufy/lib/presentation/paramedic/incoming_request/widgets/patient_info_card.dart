import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rescufy/domain/entities/incoming_request.dart';

class PatientInfoCard extends StatelessWidget {
  const PatientInfoCard({super.key, required this.request});
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
              Container(
                padding: EdgeInsets.all(8.w),
                decoration: BoxDecoration(
                  color: const Color(0xFFDC2626).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8.r),
                ),
                child: Icon(
                  Icons.medical_services,
                  color: const Color(0xFFDC2626),
                  size: 18.sp,
                ),
              ),
              SizedBox(width: 10.w),
              Text(
                'Patient Information',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 15.sp,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          SizedBox(height: 14.h),
          _row('Name', request.patientName),
          _row('Age', '${request.patientAge} years old'),
          _row('Gender', request.patientGender),
          if (request.bloodType != null) _row('Blood Type', request.bloodType!),
          Divider(color: const Color(0xFF2A3142), height: 24.h),
          _row(
            'Emergency Type',
            request.emergencyType,
            valueColor: Colors.white,
          ),
          _row('Case ID', request.caseId),
          SizedBox(height: 10.h),
          Text(
            request.description,
            style: TextStyle(
              color: Colors.white70,
              fontSize: 13.sp,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _row(String label, String value, {Color? valueColor}) {
    return Padding(
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
}
