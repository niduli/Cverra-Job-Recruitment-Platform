import 'dart:io';

import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:image_picker/image_picker.dart';

import '../auth/login_screen.dart';
import '../jobs/jobs_list_screen.dart'; // Make sure this import points to your JobsListScreen

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final user = FirebaseAuth.instance.currentUser;
  final picker = ImagePicker();

  /// 🔄 UPDATE NAME & EMAIL
  Future<void> editProfile(
    String currentName,
    String currentEmail,
  ) async {
    final nameController = TextEditingController(text: currentName);
    final emailController = TextEditingController(text: currentEmail);

    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF132235),
        title: const Text(
          "Edit Profile",
          style: TextStyle(color: Colors.white),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameController,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                labelText: "Name",
                labelStyle: TextStyle(color: Colors.white70),
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: emailController,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                labelText: "Email",
                labelStyle: TextStyle(color: Colors.white70),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            child: const Text("Cancel"),
            onPressed: () => Navigator.pop(context),
          ),
          ElevatedButton(
            child: const Text("Save"),
            onPressed: () async {
              try {
                /// Update email in Firebase Auth
                if (emailController.text != currentEmail) {
                  await user!.updateEmail(emailController.text.trim());
                }

                /// Update Firestore
                await FirebaseFirestore.instance
                    .collection('users')
                    .doc(user!.uid)
                    .update({
                  'name': nameController.text.trim(),
                  'email': emailController.text.trim(),
                });

                Navigator.pop(context);
              } catch (e) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(e.toString())),
                );
              }
            },
          ),
        ],
      ),
    );
  }

  /// 📸 UPLOAD PROFILE IMAGE
  Future<void> pickProfileImage() async {
    final pickedFile =
        await picker.pickImage(source: ImageSource.gallery, imageQuality: 70);

    if (pickedFile == null) return;

    final file = File(pickedFile.path);

    final ref = FirebaseStorage.instance
        .ref()
        .child('profile_images')
        .child('${user!.uid}.jpg');

    await ref.putFile(file);

    final imageUrl = await ref.getDownloadURL();

    await FirebaseFirestore.instance
        .collection('users')
        .doc(user!.uid)
        .update({'photoUrl': imageUrl});
  }

  /// 🔙 HANDLE BACK PRESS
  Future<bool> _onWillPop() async {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const JobsListScreen()),
    );
    return false; // prevent default pop
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: _onWillPop, // intercept Android/iOS back gesture
      child: Scaffold(
        backgroundColor: const Color(0xFF0B1622),
        appBar: AppBar(
          backgroundColor: const Color(0xFF0B1622),
          elevation: 0,
          title: const Text("Profile"),
          centerTitle: true,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (_) => const JobsListScreen()),
              );
            },
          ),
        ),
        body: StreamBuilder<DocumentSnapshot>(
          stream: FirebaseFirestore.instance
              .collection('users')
              .doc(user!.uid)
              .snapshots(),
          builder: (context, snapshot) {
            if (!snapshot.hasData) {
              return const Center(child: CircularProgressIndicator());
            }

            final data = snapshot.data!.data() as Map<String, dynamic>;

            final name = data['name'] ?? 'User';
            final email = data['email'] ?? '';
            final role = data['role'] ?? 'job_seeker';
            final photoUrl = data['photoUrl'];

            return Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  /// 👤 PROFILE IMAGE
                  Stack(
                    children: [
                      CircleAvatar(
                        radius: 48,
                        backgroundColor: Colors.blueAccent,
                        backgroundImage:
                            photoUrl != null && photoUrl != ""
                                ? NetworkImage(photoUrl)
                                : null,
                        child: photoUrl == null || photoUrl == ""
                            ? Text(
                                name[0].toUpperCase(),
                                style: const TextStyle(
                                  fontSize: 36,
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              )
                            : null,
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: InkWell(
                          onTap: pickProfileImage,
                          child: const CircleAvatar(
                            radius: 16,
                            backgroundColor: Colors.blue,
                            child: Icon(Icons.camera_alt,
                                size: 16, color: Colors.white),
                          ),
                        ),
                      )
                    ],
                  ),

                  const SizedBox(height: 15),

                  /// NAME
                  Text(
                    name,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 5),

                  /// EMAIL
                  Text(
                    email,
                    style: const TextStyle(color: Colors.white70),
                  ),

                  const SizedBox(height: 8),

                  /// ROLE
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white10,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      role == 'job_seeker' ? "Job Seeker" : "Employer",
                      style: const TextStyle(color: Colors.white70),
                    ),
                  ),

                  const SizedBox(height: 30),

                  /// OPTIONS
                  profileItem(
                    Icons.edit,
                    "Edit Profile",
                    () => editProfile(name, email),
                  ),
                  profileItem(Icons.lock_outline, "Change Password", () async {
                    await FirebaseAuth.instance
                        .sendPasswordResetEmail(email: email);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("Reset email sent")),
                    );
                  }),
                  profileItem(Icons.help_outline, "Help & Support", () {}),

                  const Spacer(),

                  /// LOGOUT
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.logout),
                      label: const Text("Logout"),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.redAccent,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      onPressed: () async {
                        await FirebaseAuth.instance.signOut();
                        Navigator.pushAndRemoveUntil(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const LoginScreen(),
                          ),
                          (route) => false,
                        );
                      },
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  Widget profileItem(IconData icon, String title, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 15),
        padding: const EdgeInsets.all(15),
        decoration: BoxDecoration(
          color: const Color(0xFF132235),
          borderRadius: BorderRadius.circular(14),
        ),
        child: Row(
          children: [
            Icon(icon, color: Colors.white),
            const SizedBox(width: 15),
            Text(
              title,
              style: const TextStyle(color: Colors.white, fontSize: 16),
            ),
            const Spacer(),
            const Icon(Icons.arrow_forward_ios,
                size: 16, color: Colors.white54),
          ],
        ),
      ),
    );
  }
}