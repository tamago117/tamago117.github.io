---
title: "FluidicSwarm / Fluidic Body: Swarm Robots as a Fluid Extension of the Hand"
summary: Operate a swarm of fluid-imitating robots as an extension of the hand — open the hand to make it soft, close it to make it hard.
category: research
tags: [Robotics]
period: "2025–2026"
year: 2026
image: ../../assets/projects/fluidic-body-teaser.jpg
thumbnail: ../../assets/projects/fluidic-body-card.jpg
featured: false
related: [robot-swarm]
links:
  - { label: arXiv, url: "https://arxiv.org/abs/2611.06068" }
  - { label: Paper (ACM DL), url: "https://doi.org/10.1145/3859323" }
gallery:
  - src: ../../assets/projects/fluidic-body-system.png
    caption: System design. The user's hand shape, height, and outline, captured by a hand-tracking camera, set the fluid properties and the swarm area given to the controller.
  - src: ../../assets/projects/fluidic-body-vr.jpg
    caption: First-person view of the VR user study. The participant guides the swarm with tracked hands toward the goal while dealing with obstacles and transport objects.
  - src: ../../assets/projects/fluidic-body-realworld.jpg
    caption: Real-world demonstration apparatus. The user guides the swarm robots on the table with a hand to avoid objects and transport them to the pick-up zone.
  - src: ../../assets/projects/fluidic-body-applications.jpg
    caption: "Applications: (a) navigation in cluttered space, (b) shape representation with both hands, (c) multi-person operation."
---

Swarm robots can reshape their formation to fit the objects and surroundings they work with, but adapting the swarm's behavior is still hard for a human operator.
**Fluidic Body** lets a person operate a swarm of fluid-imitating robots as an extension of the hand.
The system places a virtual fluid between the hand and the swarm, and the user changes the fluid's properties through simple hand movements:
an **open hand** makes the swarm soft enough to deform and flow around obstacles, and a **closed hand** turns it into a hard, cohesive body that can push objects.

- In simulation, the controller handled both obstacle avoidance and object transportation better than an existing method that behaves the same way in every task.
- In a VR user study (17 participants), users completed the combined avoidance-and-transportation task faster and more reliably, with lower workload and a stronger sense of agency.
- The experience carried over to physical robots in a real-world demonstration with 88 participants.

The interactive demo was first shown as **FluidicSwarm** at ACM SIGGRAPH 2025 Emerging Technologies, and the full study is published in Proc. ACM HCI (ISS 2026).
