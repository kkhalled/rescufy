// lib/presentation/features/request/views/emergency_form_screen.dart
import 'package:flutter/material.dart';
import 'package:rescufy/core/theme/colors.dart';

class EmergencyFormScreen extends StatefulWidget {
  final bool isSelfCase;

  const EmergencyFormScreen({super.key, required this.isSelfCase});

  @override
  State<EmergencyFormScreen> createState() => _EmergencyFormScreenState();
}

class _EmergencyFormScreenState extends State<EmergencyFormScreen> {
  final _descriptionController = TextEditingController();
  String? _currentAddress = 'Detecting location...';
  bool _isLoading = false;
  bool _locationLoading = true;

  @override
  void initState() {
    super.initState();
    // Simulate location detection
    _detectLocation();
  }

  Future<void> _detectLocation() async {
    await Future.delayed(const Duration(seconds: 2));
    setState(() {
      _locationLoading = false;
      _currentAddress = '123 Main St, San Francisco, CA 94102';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.isSelfCase ? 'Request Ambulance' : 'Report Emergency',
        ),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Emergency type indicator
            Chip(
              backgroundColor: widget.isSelfCase
                  ? AppColors.primary.withOpacity(0.1)
                  : const Color(0xFF1976D2).withOpacity(0.1),
              label: Text(
                widget.isSelfCase
                    ? 'Personal Emergency'
                    : 'Reporting for Others',
                style: TextStyle(
                  color: widget.isSelfCase
                      ? AppColors.primary
                      : const Color(0xFF1976D2),
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),

            const SizedBox(height: 30),

            // Description field
            Text(
              'Describe the emergency *',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _descriptionController,
              maxLines: 5,
              decoration: InputDecoration(
                hintText:
                    'Please provide details:\n• What happened?\n• Number of people involved\n• Visible injuries\n• Any immediate dangers',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                contentPadding: const EdgeInsets.all(16),
              ),
            ),

            const SizedBox(height: 30),

            // Location section
            Text(
              'Your Location',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Row(
                children: [
                  Icon(Icons.location_on, color: AppColors.primary),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _locationLoading
                              ? 'Detecting location...'
                              : 'Location detected',
                          style: TextStyle(
                            fontWeight: FontWeight.w500,
                            color: _locationLoading
                                ? Colors.grey
                                : AppColors.textPrimary,
                          ),
                        ),
                        if (!_locationLoading) ...[
                          const SizedBox(height: 4),
                          Text(
                            _currentAddress!,
                            style: TextStyle(
                              fontSize: 14,
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                  if (!_locationLoading)
                    IconButton(
                      icon: const Icon(Icons.refresh),
                      onPressed: _detectLocation,
                      tooltip: 'Refresh location',
                    ),
                ],
              ),
            ),

            const SizedBox(height: 30),

            // Additional Information (optional)
            ExpansionTile(
              title: Text(
                'Additional Information (Optional)',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              children: [
                const SizedBox(height: 16),
                TextField(
                  decoration: InputDecoration(
                    labelText: 'Number of people affected',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 16),
                TextField(
                  decoration: InputDecoration(
                    labelText: 'Age of affected person(s)',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  decoration: InputDecoration(
                    labelText: 'Any known medical conditions',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 40),

            // Submit button
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _submitEmergency,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.send, size: 20),
                          const SizedBox(width: 10),
                          Text(
                            'SEND EMERGENCY REQUEST',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
              ),
            ),

            const SizedBox(height: 20),

            // Note
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.blue.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.blue.shade100),
              ),
              child: Row(
                children: [
                  Icon(Icons.info_outline, color: Colors.blue.shade700),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Your request will be analyzed by AI and sent to our emergency response team immediately.',
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.blue.shade800,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _submitEmergency() async {
    if (_descriptionController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please describe the emergency')),
      );
      return;
    }

    setState(() => _isLoading = true);

    // Simulate API call
    await Future.delayed(const Duration(seconds: 2));

    setState(() => _isLoading = false);

    // Show success dialog
    _showSuccessDialog(context);
  }

  void _showSuccessDialog(BuildContext context) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            Icon(Icons.check_circle, color: Colors.green),
            const SizedBox(width: 10),
            Text('Request Submitted'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Your emergency request has been received.'),
            const SizedBox(height: 16),
            Text('🚑 Ambulance: #AMB-001'),
            Text('⏱️ ETA: 12-15 minutes'),
            const SizedBox(height: 16),
            Text(
              'Our team is analyzing your request and will dispatch help immediately.',
              style: TextStyle(fontSize: 13, color: Colors.grey.shade600),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context); // Close dialog
              Navigator.pop(context); // Go back to home
            },
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }
}
