import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import 'job_detail_screen.dart';
import '../profile/profile_screen.dart';

class JobsListScreen extends StatefulWidget {
  const JobsListScreen({super.key});

  @override
  State<JobsListScreen> createState() => _JobsListScreenState();
}

class _JobsListScreenState extends State<JobsListScreen> {
  int selectedTab = 0;
  String selectedCategory = "All";

  final user = FirebaseAuth.instance.currentUser;

  /// 🔹 USER STREAM
  Stream<DocumentSnapshot<Map<String, dynamic>>> getUserStream() {
    return FirebaseFirestore.instance
        .collection('users')
        .doc(user!.uid)
        .snapshots();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B1622),

      body: SafeArea(
        child: Column(
          children: [

            /// 🔥 HEADER
            StreamBuilder<DocumentSnapshot<Map<String, dynamic>>>(
              stream: getUserStream(),
              builder: (context, snapshot) {
                if (!snapshot.hasData) {
                  return const Padding(
                    padding: EdgeInsets.all(20),
                    child: LinearProgressIndicator(),
                  );
                }

                final data = snapshot.data!.data() ?? {};
                final name = data['name'] ?? 'Job Seeker';

                return Padding(
                  padding: const EdgeInsets.all(20),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 26,
                        backgroundColor: Colors.blueAccent,
                        child: Text(
                          name.toString().isNotEmpty
                              ? name[0].toUpperCase()
                              : 'J',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "Welcome back,",
                            style: TextStyle(color: Colors.white70),
                          ),
                          Text(
                            name,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: const Color(0xFF132235),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(
                          Icons.notifications_none,
                          color: Colors.white,
                        ),
                      )
                    ],
                  ),
                );
              },
            ),

            /// 🔍 SEARCH BAR
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: TextField(
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  hintText: "Search jobs, companies...",
                  hintStyle: const TextStyle(color: Colors.white54),
                  prefixIcon:
                      const Icon(Icons.search, color: Colors.white54),
                  filled: true,
                  fillColor: const Color(0xFF132235),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 15),

            /// 🏷 CATEGORY
            SizedBox(
              height: 40,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                children: [
                  categoryChip("All"),
                  categoryChip("Engineering"),
                  categoryChip("Design"),
                  categoryChip("Marketing"),
                ],
              ),
            ),

            const SizedBox(height: 20),

            /// TITLE
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  Text(
                    "Recommended Jobs",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Spacer(),
                  Text("View all",
                      style: TextStyle(color: Colors.blueAccent)),
                ],
              ),
            ),

            const SizedBox(height: 10),

            /// 🔥 JOB LIST
            Expanded(
              child: StreamBuilder<QuerySnapshot>(
                stream: FirebaseFirestore.instance
                    .collection('jobs')
                    .where('status', isEqualTo: 'active')
                    .snapshots(),
                builder: (context, snapshot) {
                  if (!snapshot.hasData) {
                    return const Center(
                        child: CircularProgressIndicator());
                  }

                  final docs = snapshot.data!.docs.where((doc) {
                    final data = doc.data() as Map<String, dynamic>;
                    if (selectedCategory == "All") return true;
                    return data['category'] == selectedCategory;
                  }).toList();

                  if (docs.isEmpty) {
                    return const Center(
                      child: Text(
                        "No jobs available",
                        style: TextStyle(color: Colors.white70),
                      ),
                    );
                  }

                  return ListView.builder(
                    padding: const EdgeInsets.all(20),
                    itemCount: docs.length,
                    itemBuilder: (context, index) {
                      final data =
                          docs[index].data() as Map<String, dynamic>;

                      return GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) =>
                                  JobDetailScreen(job: docs[index]),
                            ),
                          );
                        },
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 18),
                          padding: const EdgeInsets.all(18),
                          decoration: BoxDecoration(
                            color: const Color(0xFF132235),
                            borderRadius: BorderRadius.circular(18),
                          ),
                          child: Column(
                            crossAxisAlignment:
                                CrossAxisAlignment.start,
                            children: [
                              Text(
                                data['title'] ?? '',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                data['location'] ?? '',
                                style: const TextStyle(
                                    color: Colors.white70),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),

      /// 🔻 BOTTOM NAV (FIXED)
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: selectedTab,
        backgroundColor: const Color(0xFF132235),
        selectedItemColor: Colors.blueAccent,
        unselectedItemColor: Colors.white54,
        onTap: _onBottomNavTap,
        items: const [
          BottomNavigationBarItem(
              icon: Icon(Icons.explore), label: "Explore"),
          BottomNavigationBarItem(
              icon: Icon(Icons.check_circle_outline),
              label: "Applied"),
          BottomNavigationBarItem(
              icon: Icon(Icons.description_outlined), label: "CV"),
          BottomNavigationBarItem(
              icon: Icon(Icons.person_outline), label: "Profile"),
        ],
      ),
    );
  }

  /// 🔹 NAVIGATION HANDLER (IMPORTANT)
  void _onBottomNavTap(int index) {
    if (index == 3) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => const ProfileScreen(),
        ),
      );
      return;
    }

    setState(() {
      selectedTab = index;
    });
  }

  /// HELPERS
  Widget chip(String text) {
    return Container(
      padding:
          const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: Colors.white10,
        borderRadius: BorderRadius.circular(8),
      ),
      child:
          Text(text, style: const TextStyle(color: Colors.white70)),
    );
  }

  Widget categoryChip(String text) {
    final selected = selectedCategory == text;
    return GestureDetector(
      onTap: () => setState(() => selectedCategory = text),
      child: Container(
        margin: const EdgeInsets.only(right: 10),
        padding:
            const EdgeInsets.symmetric(horizontal: 15),
        decoration: BoxDecoration(
          color: selected
              ? Colors.blueAccent
              : const Color(0xFF132235),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Center(
          child: Text(
            text,
            style: TextStyle(
              color:
                  selected ? Colors.white : Colors.white70,
            ),
          ),
        ),
      ),
    );
  }
}