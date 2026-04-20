import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rescufy/presentation/paramedic/incoming_request/cubit/incoming_request_cubit.dart';
import 'package:rescufy/presentation/paramedic/incoming_request/cubit/incoming_request_state.dart';

const _presetReasons = [
  'Vehicle malfunction',
  'Medical emergency — self',
  'Out of service area',
  'Shift ended',
  'Equipment unavailable',
  'Other',
];

class RefuseBottomSheet extends StatefulWidget {
  const RefuseBottomSheet({super.key});

  @override
  State<RefuseBottomSheet> createState() => _RefuseBottomSheetState();
}

class _RefuseBottomSheetState extends State<RefuseBottomSheet> {
  String? _selected;
  final _customController = TextEditingController();
  bool get _showCustom => _selected == 'Other';

  @override
  void dispose() {
    _customController.dispose();
    super.dispose();
  }

  String? get _finalReason {
    if (_selected == null) return null;
    if (_showCustom) {
      final custom = _customController.text.trim();
      return custom.isEmpty ? null : custom;
    }
    return _selected;
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<IncomingRequestCubit, IncomingRequestState>(
      builder: (context, state) {
        final isRefusing = state.status == IncomingRequestStatus.refusing;

        return Container(
          decoration: BoxDecoration(
            color: const Color(0xFF1A1F2E),
            borderRadius: BorderRadius.vertical(top: Radius.circular(24.r)),
          ),
          padding: EdgeInsets.fromLTRB(
            20.w,
            16.h,
            20.w,
            MediaQuery.of(context).viewInsets.bottom + 24.h,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40.w,
                height: 4.h,
                decoration: BoxDecoration(
                  color: const Color(0xFF2A3142),
                  borderRadius: BorderRadius.circular(2.r),
                ),
              ),
              SizedBox(height: 20.h),
              Text(
                'Refuse Request',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18.sp,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 6.h),
              Text(
                'Select a reason for refusing this assignment',
                style: TextStyle(color: Colors.white54, fontSize: 13.sp),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 20.h),
              ..._presetReasons.map(
                (reason) => _ReasonTile(
                  label: reason,
                  selected: _selected == reason,
                  onTap: () => setState(() => _selected = reason),
                ),
              ),
              if (_showCustom) ...[
                SizedBox(height: 12.h),
                TextField(
                  controller: _customController,
                  style: TextStyle(color: Colors.white, fontSize: 14.sp),
                  decoration: InputDecoration(
                    hintText: 'Enter your reason...',
                    hintStyle: TextStyle(
                      color: Colors.white38,
                      fontSize: 14.sp,
                    ),
                    filled: true,
                    fillColor: const Color(0xFF0A0E1A),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12.r),
                      borderSide: const BorderSide(color: Color(0xFF2A3142)),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12.r),
                      borderSide: const BorderSide(color: Color(0xFF2A3142)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12.r),
                      borderSide: const BorderSide(
                        color: Color(0xFFDC2626),
                        width: 2,
                      ),
                    ),
                  ),
                ),
              ],
              SizedBox(height: 20.h),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: isRefusing || _finalReason == null
                      ? null
                      : () => context
                            .read<IncomingRequestCubit>()
                            .refuseRequest(_finalReason!),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFDC2626),
                    disabledBackgroundColor: const Color(0xFF3A3142),
                    padding: EdgeInsets.symmetric(vertical: 16.h),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.r),
                    ),
                  ),
                  child: isRefusing
                      ? SizedBox(
                          width: 20.w,
                          height: 20.h,
                          child: const CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : Text(
                          'Confirm Refusal',
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
      },
    );
  }
}

class _ReasonTile extends StatelessWidget {
  const _ReasonTile({
    required this.label,
    required this.selected,
    required this.onTap,
  });
  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        margin: EdgeInsets.only(bottom: 8.h),
        padding: EdgeInsets.symmetric(horizontal: 14.w, vertical: 12.h),
        decoration: BoxDecoration(
          color: selected
              ? const Color(0xFFDC2626).withOpacity(0.12)
              : const Color(0xFF0A0E1A),
          borderRadius: BorderRadius.circular(12.r),
          border: Border.all(
            color: selected
                ? const Color(0xFFDC2626).withOpacity(0.6)
                : const Color(0xFF2A3142),
          ),
        ),
        child: Row(
          children: [
            Expanded(
              child: Text(
                label,
                style: TextStyle(
                  color: selected ? Colors.white : Colors.white70,
                  fontSize: 14.sp,
                ),
              ),
            ),
            if (selected)
              Icon(
                Icons.check_circle,
                color: const Color(0xFFDC2626),
                size: 18.sp,
              ),
          ],
        ),
      ),
    );
  }
}
