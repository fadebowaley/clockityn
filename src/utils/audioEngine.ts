// Ambient Web Audio API Synthesizer to simulate premium background sermon pads
class SermonAudioEngine {
  private audioCtx: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private filterNode: BiquadFilterNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayGain: GainNode | null = null;
  private isPlayingSynth = false;
  private synthInterval: any = null;

  init() {
    if (this.audioCtx) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  // Play a beautiful, serene worship chord progression (C - F - Am - G swell)
  startAmbientPad() {
    this.init();
    if (!this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (this.isPlayingSynth) return;
    this.isPlayingSynth = true;

    const ctx = this.audioCtx;

    // Create filter for a deep, warm pad sound (cut off high frequencies)
    this.filterNode = ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(350, ctx.currentTime);
    this.filterNode.Q.setValueAtTime(1, ctx.currentTime);

    // Create subtle delay effect for spaciousness
    this.delayNode = ctx.createDelay(2.0);
    this.delayNode.delayTime.setValueAtTime(0.6, ctx.currentTime);
    
    this.delayGain = ctx.createGain();
    this.delayGain.gain.setValueAtTime(0.25, ctx.currentTime);

    // Connect delay loop
    this.delayNode.connect(this.delayGain);
    this.delayGain.connect(this.delayNode);

    // Master gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.15, ctx.currentTime);

    // Connect nodes
    this.filterNode.connect(masterGain);
    this.filterNode.connect(this.delayNode);
    this.delayGain.connect(masterGain);
    masterGain.connect(ctx.destination);

    let step = 0;
    const chords = [
      [130.81, 164.81, 196.00, 261.63], // C Major
      [174.61, 220.00, 261.63, 349.23], // F Major
      [110.00, 130.81, 164.81, 220.00], // A Minor
      [146.83, 196.00, 246.94, 293.66], // G Major
    ];

    const playChord = (frequencies: number[]) => {
      // Clear old notes
      this.oscillators.forEach(osc => {
        try { osc.stop(); } catch(e) {}
      });
      this.oscillators = [];
      this.gainNodes = [];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        // Use triangle wave for a woodwind/flute-like ambient tone
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const gainNode = ctx.createGain();
        // Soft volume swell
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 1.5);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 5.5);

        osc.connect(gainNode);
        if (this.filterNode) {
          gainNode.connect(this.filterNode);
        }

        osc.start();
        osc.stop(ctx.currentTime + 6.0);

        this.oscillators.push(osc);
        this.gainNodes.push(gainNode);
      });
    };

    // Immediate play
    playChord(chords[0]);

    // Loop progression every 6 seconds
    this.synthInterval = setInterval(() => {
      step = (step + 1) % chords.length;
      playChord(chords[step]);
    }, 6000);
  }

  stopAmbientPad() {
    this.isPlayingSynth = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    
    this.oscillators.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    this.oscillators = [];
    this.gainNodes = [];
  }
}

export const audioEngine = new SermonAudioEngine();
