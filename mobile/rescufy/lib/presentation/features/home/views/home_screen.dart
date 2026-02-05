// lib/presentation/features/home/views/home_screen.dart
import 'package:flutter/material.dart';
import 'package:rescufy/core/theme/colors.dart';
import 'package:rescufy/presentation/features/home/widgets/emergency_option_card.dart';
import 'package:rescufy/presentation/features/home/widgets/info_card.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        title: const Text('Rescufy'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {
              // TODO: Navigate to notifications
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome Header
            _buildWelcomeHeader(),

            const SizedBox(height: 30),

            // Emergency Services Available 24/7
            Text(
              'Emergency Services Available 24/7',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey.shade600,
                fontWeight: FontWeight.w500,
              ),
            ),

            const SizedBox(height: 20),

            // Request Ambulance Card
            EmergencyOptionCard(
              title: 'Request Ambulance',
              subtitle: 'For myself or family member',
              icon: Icons.local_hospital,
              color: AppColors.primary,
              onTap: () {
                _navigateToEmergencyForm(context, isSelfCase: true);
              },
            ),

            const SizedBox(height: 16),

            // Report Someone Else Card
            EmergencyOptionCard(
              title: 'Report Someone Else',
              subtitle: 'Witnessing an emergency situation',
              icon: Icons.people,
              color: const Color(0xFF1976D2), // Blue color
              onTap: () {
                _navigateToEmergencyForm(context, isSelfCase: false);
              },
            ),

            const SizedBox(height: 32),

            // Quick Access Section Title
            Text(
              'Quick Access',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Colors.grey.shade800,
              ),
            ),

            const SizedBox(height: 16),

            // Two Column Layout for Info Cards
            Row(
              children: [
                // First Aid Guide Card
                Expanded(
                  child: InfoCard(
                    title: 'First Aid Guide',
                    subtitle: 'Emergency care instructions',
                    icon: Icons.medical_services,
                    iconColor: const Color(0xFF2E7D32), // Green
                    onTap: () {
                      _showFirstAidGuide(context);
                    },
                  ),
                ),

                const SizedBox(width: 12),

                // Hospitals Nearby Card
                Expanded(
                  child: InfoCard(
                    title: 'Hospitals Nearby',
                    subtitle: 'Find nearest medical facilities',
                    icon: Icons.location_on,
                    iconColor: const Color(0xFFF57C00), // Orange
                    onTap: () {
                      _showNearbyHospitals(context);
                    },
                  ),
                ),
              ],
            ),

            const SizedBox(height: 40),
          ],
        ),
      ),

      // Bottom Navigation Bar
      bottomNavigationBar: _buildBottomNavigationBar(context),
    );
  }

  // Welcome Header Widget
  Widget _buildWelcomeHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Welcome Back,',
          style: TextStyle(fontSize: 16, color: Colors.grey.shade600),
        ),
        const SizedBox(height: 4),
        Text(
          'Sara John', // TODO: Replace with actual user name
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
      ],
    );
  }

  // Bottom Navigation Bar
  BottomNavigationBar _buildBottomNavigationBar(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: 0, // Home is selected
      selectedItemColor: AppColors.primary,
      unselectedItemColor: Colors.grey.shade600,
      showSelectedLabels: true,
      showUnselectedLabels: true,
      type: BottomNavigationBarType.fixed,
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
        BottomNavigationBarItem(icon: Icon(Icons.history), label: 'History'),
        BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
      ],
      onTap: (index) {
        // Handle navigation
        switch (index) {
          case 0:
            // Already on home
            break;
          case 1:
            _navigateToHistory(context);
            break;
          case 2:
            _navigateToProfile(context);
            break;
        }
      },
    );
  }

  // Navigation Methods
  void _navigateToEmergencyForm(
    BuildContext context, {
    required bool isSelfCase,
  }) {
    Navigator.pushNamed(context, '/emergency-form', arguments: isSelfCase);
  }

  void _showFirstAidGuide(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('First Aid Guide'),
        content: const SingleChildScrollView(
          child: Text(
            'Basic First Aid Instructions:\n\n'
            '1. Check the scene for safety\n'
            '2. Call for emergency help\n'
            '3. Check responsiveness\n'
            '4. Perform CPR if needed\n'
            '5. Stop bleeding with pressure\n'
            '6. Treat for shock\n'
            '7. Monitor until help arrives',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _showNearbyHospitals(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Nearby Hospitals'),
        content: const SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('1. City General Hospital - 2.3 km'),
              SizedBox(height: 8),
              Text('2. Emergency Medical Center - 3.1 km'),
              SizedBox(height: 8),
              Text('3. Rescue Hospital - 4.5 km'),
              SizedBox(height: 8),
              Text('4. First Aid Clinic - 1.8 km'),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _navigateToHistory(BuildContext context) {
    Navigator.pushNamed(context, '/history');
  }

  void _navigateToProfile(BuildContext context) {
    Navigator.pushNamed(context, '/profile');
  }
}
