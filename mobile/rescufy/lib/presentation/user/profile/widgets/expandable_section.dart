// lib/presentation/user/profile/widgets/expandable_section.dart
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ExpandableSection extends StatelessWidget {
  final String title;
  final IconData icon;
  final int count;
  final List<Widget> children;
  final Color? color;
  final VoidCallback? onAdd;

  const ExpandableSection({
    super.key,
    required this.title,
    required this.icon,
    required this.count,
    required this.children,
    this.color,
    this.onAdd,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final accentColor = color ?? theme.colorScheme.primary;

    return Card(
      child: ExpansionTile(
        leading: Padding(
          padding: EdgeInsets.only(top: 6.h),
          child: Icon(icon, color: accentColor),
        ),
        title: Text(
          title,
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w700,
          ),
        ),
        subtitle: Text('$count ${count == 1 ? 'item' : 'items'}'),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (onAdd != null)
              GestureDetector(
                onTap: onAdd,
                child: Container(
                  padding: EdgeInsets.all(6.w),
                  margin: EdgeInsets.only(right: 4.w),
                  decoration: BoxDecoration(
                    color: accentColor.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(8.r),
                  ),
                  child: Icon(Icons.add, size: 18.sp, color: accentColor),
                ),
              ),
            const Icon(Icons.chevron_right),
          ],
        ),
        children: [
          if (children.isEmpty)
            Padding(
              padding: EdgeInsets.all(24.w),
              child: Column(
                children: [
                  Icon(icon, size: 36.sp, color: Colors.grey.shade300),
                  SizedBox(height: 8.h),
                  Text(
                    'No $title yet',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: Colors.grey,
                    ),
                  ),
                  if (onAdd != null) ...[
                    SizedBox(height: 12.h),
                    TextButton.icon(
                      onPressed: onAdd,
                      icon: const Icon(Icons.add),
                      label: Text('Add $title'),
                    ),
                  ],
                ],
              ),
            )
          else
            Padding(
              padding: EdgeInsets.all(16.w),
              child: Column(children: children),
            ),
        ],
      ),
    );
  }
}
