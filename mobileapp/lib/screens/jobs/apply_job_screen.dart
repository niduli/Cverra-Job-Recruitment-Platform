import 'dart:io';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class ApplyJobScreen extends StatefulWidget {
  final String jobId;
  const ApplyJobScreen({super.key, required this.jobId});

  @override
  State<ApplyJobScreen> createState() => _ApplyJobScreenState();
}

class _ApplyJobScreenState extends State<ApplyJobScreen> {
  File? cv;

  pickCV() async {
    final res = await FilePicker.platform.pickFiles();
    if (res != null) setState(() => cv = File(res.files.single.path!));
  }

  submit() async {
    final ref = FirebaseStorage.instance
        .ref('cvs/${DateTime.now().millisecondsSinceEpoch}.pdf');
    await ref.putFile(cv!);
    final url = await ref.getDownloadURL();

    await FirebaseFirestore.instance.collection('applications').add({
      'jobId': widget.jobId,
      'userId': FirebaseAuth.instance.currentUser!.uid,
      'status': 'pending',
      'cvUrl': url,
      'createdAt': Timestamp.now(),
    });

    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Apply Job")),
      body: Column(
        children: [
          ElevatedButton(onPressed: pickCV, child: const Text("Upload CV")),
          ElevatedButton(onPressed: cv == null ? null : submit, child: const Text("Submit"))
        ],
      ),
    );
  }
}