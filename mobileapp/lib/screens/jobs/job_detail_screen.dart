import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'apply_job_screen.dart';

class JobDetailScreen extends StatelessWidget {
  final QueryDocumentSnapshot job;
  const JobDetailScreen({super.key, required this.job});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(job['title'])),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(job['company'], style: const TextStyle(fontSize: 18)),
            const SizedBox(height: 10),
            Text(job['description']),
            const Spacer(),
            ElevatedButton(
              child: const Text("Apply"),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => ApplyJobScreen(jobId: job.id),
                  ),
                );
              },
            )
          ],
        ),
      ),
    );
  }
}