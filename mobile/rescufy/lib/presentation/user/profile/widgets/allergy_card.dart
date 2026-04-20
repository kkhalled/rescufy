// lib/presentation/user/profile/widgets/allergy_card.dart
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class AllergyCard extends StatelessWidget {
  final Map<String, String> allergy;
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;

  const AllergyCard({
    super.key,
    required this.allergy,
    this.onEdit,
    this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final severityColor = allergy['severity'] == 'Severe'
        ? Colors.red
        : allergy['severity'] == 'Moderate'
        ? Colors.orange
        : Colors.yellow.shade700;

    return Container(
      margin: EdgeInsets.only(bottom: 12.h),
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: severityColor.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12.r),
        border: Border.all(color: severityColor.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.warning_amber_rounded,
                size: 20.sp,
                color: severityColor,
              ),
              SizedBox(width: 8.w),
              Expanded(
                child: Text(
                  allergy['name']!,
                  style: theme.textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              Container(
                padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 4.h),
                decoration: BoxDecoration(
                  color: severityColor.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8.r),
                ),
                child: Text(
                  allergy['severity']!,
                  style: TextStyle(
                    fontSize: 11.sp,
                    fontWeight: FontWeight.w600,
                    color: severityColor,
                  ),
                ),
              ),
              SizedBox(width: 4.w),
              _CardActions(onEdit: onEdit, onDelete: onDelete),
            ],
          ),
          SizedBox(height: 8.h),
          Text(allergy['notes']!, style: theme.textTheme.bodySmall),
        ],
      ),
    );
  }
}

class _CardActions extends StatelessWidget {
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;
  const _CardActions({this.onEdit, this.onDelete});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (onEdit != null)
          InkWell(
            onTap: onEdit,
            borderRadius: BorderRadius.circular(8),
            child: Padding(
              padding: EdgeInsets.all(8.w),
              child: Icon(
                Icons.edit_outlined,
                size: 18.sp,
                color: Colors.grey.shade500,
              ),
            ),
          ),
        if (onDelete != null)
          InkWell(
            onTap: onDelete,
            borderRadius: BorderRadius.circular(8),
            child: Padding(
              padding: EdgeInsets.all(4.w),
              child: Icon(
                Icons.delete_outline,
                size: 18.sp,
                color: Colors.red.shade300,
              ),
            ),
          ),
      ],
    );
  }
}
