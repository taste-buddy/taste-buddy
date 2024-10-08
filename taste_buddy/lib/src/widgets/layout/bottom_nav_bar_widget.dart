import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class BottomNavBar extends StatelessWidget {
  const BottomNavBar({super.key});

  @override
  Widget build(BuildContext context) {
    final String location = GoRouterState.of(context).uri.toString();
    int selectedIndex;
    if (location == '/') {
      selectedIndex = 0;
    } else if (location == '/plan') {
      selectedIndex = 1;
    } else {
      selectedIndex = 0;
    }

    return BottomNavigationBar(
      backgroundColor: Colors.black,
      unselectedItemColor: Colors.white54,
      selectedItemColor: Colors.orangeAccent,
      currentIndex: selectedIndex,
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.home),
          label: 'Home',
        ),
        BottomNavigationBarItem(icon:
          Icon(Icons.auto_awesome),
          label: 'Plan',
        )
      ],
      onTap: (index) {
        // Navigate to the corresponding route
        switch (index) {
          case 0:
            context.goNamed('home');
            break;
          case 1:
            context.goNamed('plan');
            break;
          default:
            context.goNamed('home');
        }
      },
    );
  }
}
