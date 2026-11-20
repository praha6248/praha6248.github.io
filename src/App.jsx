import React, { Suspense, useState, useRef, useEffect } from 'react'
import { Vector3 } from 'three'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, Center, Environment, Lightformer, CameraControls, useProgress } from '@react-three/drei'
import { Selection, Select, EffectComposer, Outline } from '@react-three/postprocessing'
import { PROJECTS, CONTACT } from './projects'
import './App.css'

const base = import.meta.env.BASE_URL

// The project list is a normal 2D overlay placed over the monitor's screen, so the browser
// renders its text and images at full resolution instead of scaling a tiny 3D layer.
const SCREEN = {
  position: [0.0109, 0.104, -0.0002],
  rotation: [0, -Math.PI / 2, 0],
  halfWidth: 0.0265,
  halfHeight: 0.0169,
  designWidth: 1600,
}

const VIEWS = {
  HOME: {
    position: [-0.266, 0.108, -0.081],
    target: [0.031, 0.051, 0.017]
  },
  MONITOR: {
    position: [-0.06, 0.092, 0.01],
    target: [0.04, 0.09, 0.01]
  },
  PAPERS: {
    position: [-0.02, 0.11, -0.03],
    target: [-0.01, 0.03, -0.03]
  }
}

function Model({ path, ...props }) {
  const { scene } = useGLTF(path)

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) obj.castShadow = true
    })
  }, [scene])

  return <primitive object={scene} {...props} />
}

// On phones the monitor is too small to read, so the list opens as a full-width panel instead.
const MOBILE_WIDTH = 760

function MonitorScreen({ rect, onClose }) {
  if (window.innerWidth < MOBILE_WIDTH) {
    rect = { left: 12, top: 120, width: window.innerWidth - 24, height: window.innerHeight - 132 }
  }
  const zoom = rect.width / SCREEN.designWidth
  return (
    <div
      id="screen-overlay"
      style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
      onWheel={(e) => e.stopPropagation()}
    >
      <div id="monitor" style={{ zoom, height: rect.height / zoom }}>
        <div className="window-header">
          <span className="window-title">Projects</span>
          <div className="window-controls">
            <div id="cross" onClick={onClose}></div>
          </div>
        </div>
        <div id="monitor-content">
          {PROJECTS.map((project) => (
            <a key={project.url} className="project" href={project.url} target="_blank" rel="noopener noreferrer">
              <img src={`${base}${project.image}`} alt={project.title} />
              <div className="card">
                <div>
                  {project.tech.map((tech) => <span key={tech} className="techStack">{tech}</span>)}
                </div>
                <div className="title">{project.title}</div>
                <div className="description">{project.description}</div>
                <img className="git" src={`${base}git.png`} alt="GitHub" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

const corner = new Vector3()

function ScreenAnchor({ onRect }) {
  const anchor = useRef()
  const last = useRef('')
  const { camera, size } = useThree()

  useFrame(() => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (const [x, y] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      corner.set(x * SCREEN.halfWidth, y * SCREEN.halfHeight, 0)
      anchor.current.localToWorld(corner).project(camera)
      const px = (corner.x + 1) / 2 * size.width
      const py = (1 - corner.y) / 2 * size.height
      minX = Math.min(minX, px); maxX = Math.max(maxX, px)
      minY = Math.min(minY, py); maxY = Math.max(maxY, py)
    }
    const rect = { left: Math.round(minX), top: Math.round(minY), width: Math.round(maxX - minX), height: Math.round(maxY - minY) }
    const key = `${rect.left},${rect.top},${rect.width},${rect.height}`
    if (key !== last.current) {
      last.current = key
      onRect(rect)
    }
  })

  return <group ref={anchor} position={SCREEN.position} rotation={SCREEN.rotation} />
}

// Views are framed for a wide screen; on narrower screens the camera backs off along
// its viewing direction so the same objects still fit horizontally.
const DESIGN_ASPECT = 1.6

function CameraHandler({ view, isLocked }) {
  const controls = useRef()
  const firstMove = useRef(true)
  const aspect = useThree((state) => state.size.width / state.size.height)

  useEffect(() => {
    const k = Math.max(1, 0.6 * DESIGN_ASPECT / aspect)
    const position = view.position.map((p, i) => view.target[i] + (p - view.target[i]) * k)
    controls.current?.setLookAt(...position, ...view.target, !firstMove.current)
    firstMove.current = false
  }, [view, aspect])

  return <CameraControls ref={controls} makeDefault enabled={!isLocked} dampingFactor={0.2} />
}

function MonitorModel({ isFocused, onClick, onScreenRect }) {
  const { scene } = useGLTF(`${base}obj/monitor2.glb`)
  const [hovered, setHover] = useState(false)

  return (
    <group>
      <Select enabled={isFocused || hovered}>
        <primitive
          object={scene}
          onClick={(e) => { e.stopPropagation(); onClick() }}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        />
      </Select>
      {isFocused && <ScreenAnchor onRect={onScreenRect} />}
    </group>
  )
}

function Papers({ isFocused, onClick }) {
  const { scene } = useGLTF(`${base}obj/kartki.glb`)
  const gl = useThree((state) => state.gl)
  const [hovered, setHover] = useState(false)

  useEffect(() => {
    const anisotropy = gl.capabilities.getMaxAnisotropy()
    scene.traverse((obj) => {
      if (obj.isMesh && obj.material.map) {
        obj.material.map.anisotropy = anisotropy
        obj.material.map.needsUpdate = true
      }
    })
  }, [scene, gl])

  return (
    <Select enabled={isFocused || hovered}>
      <primitive
        object={scene}
        onClick={(e) => { e.stopPropagation(); onClick() }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      />
    </Select>
  )
}

function Lights() {
  return (
    <Environment resolution={256}>
      <Lightformer form="rect" intensity={1.2} color="#fff3e6" position={[0, 4, 0]} rotation-x={Math.PI / 2} scale={[6, 6, 1]} />
      <Lightformer form="rect" intensity={0.6} color="#ffe2d1" position={[-4, 1, -2]} rotation-y={Math.PI / 2} scale={[4, 2, 1]} />
      <Lightformer form="rect" intensity={0.4} color="#e8e0ff" position={[4, 1, 2]} rotation-y={-Math.PI / 2} scale={[4, 2, 1]} />
      <Lightformer form="ring" intensity={0.3} color="#ffffff" position={[0, 1, 5]} scale={2} />
    </Environment>
  )
}

function LoadingScreen() {
  const { active, progress } = useProgress()
  if (!active) return null
  return (
    <div id="loading">
      <div className="loading-bar"><div style={{ width: `${progress}%` }} /></div>
      <span>{Math.round(progress)}%</span>
    </div>
  )
}

class SceneBoundary extends React.Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div id="fallback">
        <img src={`${base}og.png`} alt="3D desk with a monitor and a CV" />
        <p>The 3D scene could not load. Here are my projects:</p>
        <ul>
          {PROJECTS.map((project) => <li key={project.url}><a href={project.url}>{project.title}</a></li>)}
        </ul>
        <a className="button" href={`${base}Natalia_Plocha_CV.pdf`} download>Download CV</a>
      </div>
    )
  }
}

const icons = {
  github: 'M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.2-3.1-.1-.4-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.8 18 5.1 18 5.1c.6 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.1 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z',
  linkedin: 'M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6c.5-.9 1.7-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM7.1 20.5H3.5V9h3.6v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z',
  email: 'M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2v.5l10 6.3 10-6.3V6H2Zm20 2.9-9.5 6a1 1 0 0 1-1 0L2 8.9V18h20V8.9Z',
}

function ContactLinks() {
  return (
    <div className="contact">
      {Object.entries(CONTACT).map(([name, href]) => (
        <a key={name} href={href} target={name === 'email' ? undefined : '_blank'} rel="noopener noreferrer" aria-label={name}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d={icons[name]} /></svg>
        </a>
      ))}
    </div>
  )
}

const HASH_VIEWS = { '#projects': VIEWS.MONITOR, '#resume': VIEWS.PAPERS }
const viewFromHash = () => HASH_VIEWS[window.location.hash] ?? VIEWS.HOME

export default function App() {
  const [view, setView] = useState(viewFromHash)
  const [screenRect, setScreenRect] = useState(null)

  useEffect(() => {
    const onHashChange = () => setView(viewFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const select = (target) => {
    setView((current) => (current === target ? VIEWS.HOME : target))
  }

  const isPapersFocused = view === VIEWS.PAPERS
  const isMonitorFocused = view === VIEWS.MONITOR

  return (
    <div id="app-wrapper">
      <header id="main-header">
        <div className="header-content">
          <h1 id="name">NATALIA PŁOCHA</h1>
          <nav className="nav-menu">
            <a href="#" className={view === VIEWS.HOME ? 'active' : ''} onClick={(e) => { e.preventDefault(); select(VIEWS.HOME) }}>Home</a>
            <a href="#resume" className={isPapersFocused ? 'active' : ''} onClick={(e) => { e.preventDefault(); select(VIEWS.PAPERS) }}>Resume</a>
            <a href="#projects" className={isMonitorFocused ? 'active' : ''} onClick={(e) => { e.preventDefault(); select(VIEWS.MONITOR) }}>Projects</a>
            <ContactLinks />
          </nav>
        </div>
      </header>

      <SceneBoundary>
        <Canvas shadows camera={{ position: VIEWS.HOME.position, fov: 45, near: 0.001 }}>
          <Suspense fallback={null}>
            <Lights />
            <ambientLight intensity={0.5} />
            <directionalLight position={[1, 5, 1]} intensity={1.5} castShadow />

            <Selection>
              <EffectComposer multisampling={8} autoClear={false}>
                <Outline visibleEdgeColor="white" edgeStrength={3} width={1000} />
              </EffectComposer>

              <Center top>
                <MonitorModel isFocused={isMonitorFocused} onClick={() => select(VIEWS.MONITOR)} onScreenRect={setScreenRect} />
                <Papers isFocused={isPapersFocused} onClick={() => select(VIEWS.PAPERS)} />
                <Model path={`${base}obj/biurko.glb`} />
                <Model path={`${base}obj/akcesoria.glb`} />
              </Center>
            </Selection>

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.0001, 0]} onClick={() => select(VIEWS.HOME)} receiveShadow>
              <circleGeometry args={[0.1, 64]} />
              <meshStandardMaterial color="#1f1f1f" roughness={0.8} />
            </mesh>

            <CameraHandler view={view} isLocked={isMonitorFocused} />
          </Suspense>
        </Canvas>
      </SceneBoundary>

      {isMonitorFocused && screenRect && <MonitorScreen rect={screenRect} onClose={() => select(VIEWS.MONITOR)} />}

      <LoadingScreen />

      {isPapersFocused && (
        <a href={`${base}Natalia_Plocha_CV.pdf`} download="Natalia_Plocha_CV.pdf" id="download" onClick={(e) => e.stopPropagation()}>
          Download CV
        </a>
      )}
    </div>
  )
}
