import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rescufy/core/navigation/app_routes.dart';
import 'package:rescufy/domain/entities/incoming_request.dart';
import 'package:rescufy/presentation/paramedic/incoming_request/cubit/incoming_request_cubit.dart';
import 'package:rescufy/presentation/paramedic/incoming_request/cubit/incoming_request_state.dart';
import 'package:rescufy/presentation/paramedic/incoming_request/widgets/critical_medical_card.dart';
import 'package:rescufy/presentation/paramedic/incoming_request/widgets/patient_info_card.dart';
import 'package:rescufy/presentation/paramedic/incoming_request/widgets/location_card.dart';
import 'package:rescufy/presentation/paramedic/incoming_request/widgets/refuse_bottom_sheet.dart';

class IncomingRequestScreen extends StatelessWidget {
  const IncomingRequestScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<IncomingRequestCubit, IncomingRequestState>(
      listenWhen: (prev, curr) => prev.status != curr.status,
      listener: (context, state) {
        if (state.status == IncomingRequestStatus.refused) {
          // Refused → go back to dashboard
          Navigator.of(context).pop();
        }
        if (state.status == IncomingRequestStatus.error &&
            state.errorMessage != null) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.errorMessage!),
              backgroundColor: const Color(0xFFDC2626),
            ),
          );
        }
      },
      builder: (context, state) {
        final request = state.request;
        final isRefusing = state.status == IncomingRequestStatus.refusing;

        return Scaffold(
          backgroundColor: const Color(0xFF0A0E1A),
          appBar: AppBar(
            backgroundColor: const Color(0xFF1A1F2E),
            leading: const SizedBox.shrink(),
            automaticallyImplyLeading: false,
            title: Row(
              children: [
                _SeverityBadge(severity: request.severity),
                SizedBox(width: 12.w),
                Expanded(
                  child: Text(
                    'Incoming Request',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18.sp,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
          body: Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  padding: EdgeInsets.all(20.w),
                  child: Column(
                    children: [
                      if (request.aiSummary != null) ...[
                        _AiSummaryCard(summary: request.aiSummary!),
                        SizedBox(height: 16.h),
                      ],
                      PatientInfoCard(request: request),
                      if (request.hasCriticalMedicalData) ...[
                        SizedBox(height: 16.h),
                        CriticalMedicalCard(request: request),
                      ],
                      SizedBox(height: 16.h),
                      LocationCard(request: request),
                      SizedBox(height: 16.h),
                      _HospitalCard(hospitalName: request.hospitalName),
                      SizedBox(height: 100.h), // space for bottom buttons
                    ],
                  ),
                ),
              ),
              _ActionButtons(request: request, isRefusing: isRefusing),
            ],
          ),
        );
      },
    );
  }
}

// ── Internal widgets ─────────────────────────────────────────────────────────

class _SeverityBadge extends StatelessWidget {
  const _SeverityBadge({required this.severity});
  final String severity;

  @override
  Widget build(BuildContext context) {
    final color =
        severity.toLowerCase() == 'critical' || severity.toLowerCase() == 'high'
        ? const Color(0xFFDC2626)
        : const Color(0xFFF59E0B);

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 4.h),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(8.r),
        border: Border.all(color: color.withOpacity(0.5)),
      ),
      child: Text(
        severity.toUpperCase(),
        style: TextStyle(
          color: color,
          fontSize: 11.sp,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}

class _AiSummaryCard extends StatelessWidget {
  const _AiSummaryCard({required this.summary});
  final String summary;

  @override
  Widget build(BuildContext context) {
    return _DarkCard(
      icon: Icons.auto_awesome,
      iconColor: const Color(0xFF00D9A5),
      title: 'AI Clinical Summary',
      child: Text(
        summary,
        style: TextStyle(color: Colors.white70, fontSize: 14.sp, height: 1.6),
      ),
    );
  }
}

class _HospitalCard extends StatelessWidget {
  const _HospitalCard({required this.hospitalName});
  final String hospitalName;

  @override
  Widget build(BuildContext context) {
    return _DarkCard(
      icon: Icons.local_hospital,
      iconColor: const Color(0xFF00A8E8),
      title: 'Assigned Hospital',
      child: Text(
        hospitalName,
        style: TextStyle(
          color: Colors.white,
          fontSize: 15.sp,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

class _ActionButtons extends StatelessWidget {
  const _ActionButtons({required this.request, required this.isRefusing});
  final IncomingRequest request;
  final bool isRefusing;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(20.w, 16.h, 20.w, 24.h),
      decoration: const BoxDecoration(
        color: Color(0xFF1A1F2E),
        border: Border(top: BorderSide(color: Color(0xFF2A3142))),
      ),
      child: Row(
        children: [
          Expanded(
            child: OutlinedButton(
              onPressed: isRefusing ? null : () => _showRefuseSheet(context),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Color(0xFFDC2626)),
                padding: EdgeInsets.symmetric(vertical: 16.h),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12.r),
                ),
              ),
              child: Text(
                'Refuse',
                style: TextStyle(
                  color: const Color(0xFFDC2626),
                  fontSize: 15.sp,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
          SizedBox(width: 12.w),
          Expanded(
            flex: 2,
            child: ElevatedButton(
              onPressed: () => Navigator.of(context).pushReplacementNamed(
                AppRoutes.paramedicActiveCase,
                arguments: request,
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF00D9A5),
                padding: EdgeInsets.symmetric(vertical: 16.h),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12.r),
                ),
              ),
              child: Text(
                'Start Handling',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 15.sp,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showRefuseSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => BlocProvider.value(
        value: context.read<IncomingRequestCubit>(),
        child: const RefuseBottomSheet(),
      ),
    );
  }
}

// ── Shared dark card ─────────────────────────────────────────────────────────

class _DarkCard extends StatelessWidget {
  const _DarkCard({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.child,
  });
  final IconData icon;
  final Color iconColor;
  final String title;
  final Widget child;

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
                  color: iconColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8.r),
                ),
                child: Icon(icon, color: iconColor, size: 18.sp),
              ),
              SizedBox(width: 10.w),
              Text(
                title,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 15.sp,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          SizedBox(height: 12.h),
          child,
        ],
      ),
    );
  }
}
