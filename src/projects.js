export const PROJECTS = [
  {
    title: 'Robot arm with natural-language control',
    description: 'A fine-tuned 362M local model turns spoken-style commands into robot programs: 40/40 on the benchmark, ahead of Gemma 3 4B.',
    tech: ['Python', 'llama.cpp', 'PyTorch', 'C++'],
    image: 'projects/robot-arm-nl.webp',
    url: 'https://github.com/praha6248/Robot_arm-nl',
  },
  {
    title: 'Robot arm simulation',
    description: '6-axis arm with analytic inverse kinematics, contact-based grasping and a text robot language over TCP.',
    tech: ['C++17', 'OpenGL', 'GoogleTest'],
    image: 'projects/robot-arm.webp',
    url: 'https://github.com/praha6248/Robot_arm',
  },
  {
    title: 'Planar quadrotor with LQR',
    description: 'Discrete LQR from the Riccati equation flies a nonlinear quadrotor model to clicked targets.',
    tech: ['C++17', 'Eigen', 'SDL2'],
    image: 'projects/quadrotor.webp',
    url: 'https://github.com/praha6248/planar-quadrotor-lqr',
  },
  {
    title: 'Embedded firmware for a mobile robot',
    description: 'Bare-metal 500 Hz control loop with obstacle avoidance, PWM motor control and interrupt-driven UART.',
    tech: ['C', 'dsPIC33', 'Team of 3'],
    image: 'projects/embedded.webp',
    url: 'https://github.com/ev3nt-h0riz0n/Embedded_Systems_Project_2026',
  },
  {
    title: 'Evolutionary path planning library',
    description: 'C++17 genetic-algorithm library that plans collision-free paths for a mobile robot, with Python bindings, pip packaging and tests.',
    tech: ['C++17', 'pybind11', 'Python'],
    image: 'projects/path-planning.webp',
    url: 'https://github.com/praha6248/evolutionary-path-planning',
  },
  {
    title: 'Physics sandbox 3D',
    description: 'Falling-sand style particle simulation in the browser.',
    tech: ['React', 'Three.js'],
    image: 'projects/sandbox.webp',
    url: 'https://github.com/praha6248/physics-sandbox-3d',
  },
]

export const CONTACT = {
  github: 'https://github.com/praha6248',
  linkedin: 'https://www.linkedin.com/in/natalia-p%C5%82ocha-870428382',
  email: 'mailto:natalia.plocha6248@gmail.com',
}
