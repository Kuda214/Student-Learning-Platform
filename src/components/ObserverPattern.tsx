import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Bell, User, Play, RotateCcw, Code2, Eye, ArrowRight, ArrowLeft, Zap, Orbit } from 'lucide-react'; // Changed Toggle icons to Zap/Orbit for better theming
import { motion, AnimatePresence, color } from 'framer-motion'; // Assuming motion/react is framer-motion based on the syntax
import { UMLDiagram } from './UMLDiagram';

interface Observer {
  id: number;
  name: string;
  notified: boolean;
  showCode: boolean;
}

// Helper to calculate top position for the animated dots
const getTopPosition = (i: number) => {
  // Base position + offset per observer (3rem base height, 6rem spacing)
  return 3 * 16 + i * 6 * 16; // Convert rem to pixels (assuming 16px/rem)
};

// === Push/Pull Demo Component (Extracted & Enhanced) ===
// === Push/Pull Demo Component (Fixed) ===
// === Push/Pull Demo Component (FIXED for Alignment and Travel) ===
// === Push/Pull Demo Component (FINAL ALIGNMENT FIX) ===
function PushPullDemo() {
  const [mode, setMode] = useState<'push' | 'pull'>('push');
  const [trigger, setTrigger] = useState(0);

  const observers = [0, 1, 2];
  const animationDuration = 2.4;
  const travelDistance = 280; // Distance in pixels

  // FIX: This calculation now perfectly centers the 3px dot vertically within the 48px tall Observer box.
  const getTopPosition = (i: number) => {
    // 1. Base offset for the top of the entire Obs stack within the h-48 (192px) flex container.
    // 2. Center of the first Obs box (48px / 2 = 24px).
    // 3. Spacing between centers (h-12 + gap-6) = 48px + 24px = 72px.
    // 4. Subtract 6px to center the 3x3 dot (dot center needs to be 1.5px above the line; 3px dot means 1.5px below center for the 'top' style).
    
    // Optimized vertical top offset: 46px (This aligns the top of the dot)
    const baseTopOffset = 30; 
    const spacing = 55; // 48px (h-12) + 24px (gap-6)
    
    return baseTopOffset + i * spacing;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl shadow-inner border border-blue-200"
    >
      <h3 className="text-xl font-semibold text-blue-900 mb-2 text-center">
        {mode === 'push' ? 'Push Mode: Subject Sends Data' : 'Pull Mode: Observer Requests Data'}
      </h3>
      <p className="text-sm text-gray-700 mb-4 text-center">
        {mode === 'push'
          ? 'Orange (Data) travels directly to Observers.'
          : 'Blue (Request) travels to Subject, then Orange (Data) returns.'}
      </p>

      <div className="relative flex items-center justify-between h-48 px-10">
        {/* Subject */}
        <div className="w-24 h-24 bg-blue-900 text-white flex flex-col items-center justify-center rounded-xl shadow-lg z-10">
          <span className="text-sm font-bold">Subject</span>
        </div>

        {/* Observers */}
        <div className="flex flex-col gap-6">
          {observers.map((i) => (
            <div
              key={i}
              className="w-24 h-12 bg-slate-900 text-white flex items-center justify-center rounded-lg shadow"
            >
              Obs {i + 1}
            </div>
          ))}
        </div>

        {/* Animation Layer */}
        <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence>
            {/* PUSH Mode: Orange dots (data) */}
            {mode === 'push' &&
              observers.map((i) => (
                <motion.div
                  key={`${i}-${trigger}-push`}
                  className="absolute w-3 h-3 rounded-full bg-orange-500 shadow-md"
                  // FIX: Adjusted to 7rem for better horizontal alignment at the start
                  style={{ left: '7rem', top: `${getTopPosition(i)}px` }} 
                  initial={{ x: 0, opacity: 1 }}
                  animate={{ x: travelDistance, opacity: [1, 0.8, 0] }}
                  transition={{
                    duration: 1.5,
                    ease: 'easeInOut',
                    delay: i * 0.25,
                  }}
                />
              ))}

            {/* PULL Mode: Blue dots (requests) */}
            {mode === 'pull' &&
              observers.map((i) => (
                <motion.div
                  key={`${i}-${trigger}-pull-request`}
                  className="absolute w-3 h-3 rounded-full bg-blue-900 shadow-md"
                  // FIX: Start at the Observer side, offset by travelDistance
                  style={{ left: `calc(7rem + ${travelDistance}px)`, top: `${getTopPosition(i)}px` }} 
                  initial={{ x: 0, opacity: 1 }}
                  animate={[
                    { 
                      x: -travelDistance, // Travel back to Subject
                      opacity: 1, 
                      transition: { duration: 0.8, delay: i * 0.25, ease: 'easeInOut' } 
                    }, 
                    { 
                      opacity: 0, 
                      transition: { duration: 0.1, delay: i * 0.25 + 0.8 }
                    }
                  ]}
                />
              ))}

            {/* PULL Mode: Orange dots (data response) */}
            {mode === 'pull' &&
              observers.map((i) => (
                <motion.div
                  key={`${i}-${trigger}-pull-data`}
                  className="absolute w-3 h-3 rounded-full bg-orange-500 "
                  style={{ left: '3rem', top: `${getTopPosition(i)}px` }} // Start at Subject
                  initial={{ x: 0, opacity: 0 }}
                  animate={[
                    { 
                      x: 0, 
                      opacity: 0, 
                      transition: { duration: 0.8, delay: i * 0.25 }
                    }, 
                    { 
                      x: 0, 
                      opacity: 1, 
                      transition: { duration: 0.1, delay: i * 0.25 + 0.8 }
                    },
                    { 
                      x: travelDistance, 
                      opacity: 0, 
                      transition: { duration: 0.8, delay: i * 0.25 + 1.2, ease: 'easeInOut' }
                    }
                  ]}
                />
              ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <Button
          onClick={() => {
            setMode(mode === 'push' ? 'pull' : 'push');
            setTrigger((t) => t + 1);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          Switch to **{mode === 'push' ? 'Pull' : 'Push'}**
        </Button>
        <Button
          variant="outline"
          onClick={() => setTrigger((t) => t + 1)}
          className="border-blue-900 text-blue-900 hover:bg-blue-50"
        >
          Replay Animation
        </Button>
      </div>
    </motion.div>
  );
}

// === Main Observer Pattern Component ===
export function ObserverPattern() {
  const [observers, setObservers] = useState<Observer[]>([
    { id: 1, name: 'Mobile App', notified: false, showCode: false },
    { id: 2, name: 'Email Service', notified: false, showCode: false },
    { id: 3, name: 'SMS Service', notified: false, showCode: false },
  ]);
  const [newObserverName, setNewObserverName] = useState('');
  const [subjectState, setSubjectState] = useState('Idle');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSubjectCode, setShowSubjectCode] = useState(false);
  const [currentConcept, setCurrentConcept] = useState(0);
  const [demoMode, setDemoMode] = useState<'original' | 'pushpull'>('original');

  const notifyObservers = async () => {
    setIsAnimating(true);
    setSubjectState('Notifying...');

    setObservers((prev) => prev.map((obs) => ({ ...obs, notified: false })));

    for (let i = 0; i < observers.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setObservers((prev) =>
        prev.map((obs, idx) => (idx === i ? { ...obs, notified: true } : obs))
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubjectState('All Notified!');
    setIsAnimating(false);
  };

  const addObserver = () => {
    if (newObserverName.trim()) {
      setObservers((prev) => [
        ...prev,
        { id: Date.now(), name: newObserverName, notified: false, showCode: false },
      ]);
      setNewObserverName('');
    }
  };

  const removeObserver = (id: number) => {
    setObservers((prev) => prev.filter((obs) => obs.id !== id));
  };

  const toggleObserverView = (id: number) => {
    setObservers((prev) =>
      prev.map((obs) => (obs.id === id ? { ...obs, showCode: !obs.showCode } : obs))
    );
  };

  const reset = () => {
    setObservers((prev) => prev.map((obs) => ({ ...obs, notified: false })));
    setSubjectState('Idle');
  };

  const getObserverCode = (observer: Observer) => {
    return `class ${observer.name.replace(/\s+/g, '')}Observer {
  update(data) {
    console.log('Received:', data);
    this.handleNotification(data);
  }
  
  handleNotification(data) {
    // Process notification
    // ${observer.name} logic here
  }
}`;
  };

  const subjectCode = `class Subject {
  constructor() {
    this.observers = [];
    this.state = '${subjectState}';
  }
  
  attach(observer) {
    this.observers.push(observer);
  }
  
  detach(observer) {
    const index = this.observers.indexOf(observer);
    this.observers.splice(index, 1);
  }
  
  notify() {
    this.observers.forEach(observer => {
      observer.update(this.state);
    });
  }
  
  setState(newState) {
    this.state = newState;
    this.notify();
  }
}`;

  const concepts = [
    {
      title: 'Concept 1: The Basic Observer Pattern',
      description:
        'The Observer pattern defines a one-to-many dependency between objects. When the subject changes state, all observers are notified automatically.',
      howItWorks: [
        '• The Subject (bell icon) maintains a list of observers.',
        '• Observers register themselves with the subject.',
        '• When the subject’s state changes, it notifies all registered observers.',
        '• Each observer can respond independently to the notification.',
        '• Observers can be added or removed dynamically.',
        '• Click the code/visual toggle to see the implementation!',
      ],
    },
    {
      title: 'Concept 2: Push vs. Pull',
      description:
        'How do observers get data? Does the Subject send it (Push), or do Observers ask for it (Pull)?',
      howItWorks: [
        'Switch to the "Push/Pull Demo" using the toggle above.',
        '**PUSH Mode:** Subject sends full data to all observers.',
        '**PULL Mode:** Subject sends a signal → Observers request specific data.',
        'Push is simpler but less efficient.',
        'Pull is more flexible and efficient.',
      ],
    },
    {
      title: 'Concept 3: Real-World Example (Event Listeners)',
      description:
        'The Observer pattern is the foundation for event handling in browsers.',
      howItWorks: [
        '• The Subject: DOM element (button, input, etc.)',
        '• The Observer: Your event handler function',
        '• attach(): addEventListener() or onClick={...}',
        '• notify(): Browser triggers your handler on click',
      ],
    },
  ];

  const nextConcept = () => {
    setCurrentConcept((prev) => (prev + 1) % concepts.length);
  };

  const prevConcept = () => {
    setCurrentConcept((prev) => (prev - 1 + concepts.length) % concepts.length);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content - Left Side */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-lg border-t-1">
          <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-blue-900">Interactive Observer Pattern</CardTitle>
                <CardDescription className="" style={{color:'grey'}}>
                  Toggle between classic demo and Push/Pull animation
                </CardDescription>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDemoMode(demoMode === 'original' ? 'pushpull' : 'original')}
                className="bg-white text-blue-900 hover:bg-blue-50 flex items-center gap-2"
              >
                {demoMode === 'original' ? (
                  <>
                    <Zap className="w-4 h-4" />
                    Push/Pull Demo
                  </>
                ) : (
                  <>
                    <Orbit className="w-4 h-4" />
                    Classic Demo
                  </>
                )}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 bg-gray-50 min-h-[500px] p-6">
            <AnimatePresence mode="wait">
              {demoMode === 'original' ? (
                <motion.div
                  key="original"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* === Original Observer Demo === */}
                  {/* Subject */}
                  <div className="flex flex-col items-center space-y-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSubjectCode(!showSubjectCode)}
                      className="border-blue-900 text-blue-900 hover:bg-blue-50"
                    >
                      {showSubjectCode ? <Eye className="w-4 h-4 mr-2" /> : <Code2 className="w-4 h-4 mr-2" />}
                      {showSubjectCode ? 'Show Visual' : 'Show Code'}
                    </Button>

                    {showSubjectCode ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full"
                      >
                        <Card className="bg-slate-900 border-blue-900 border-2">
                          <CardContent className="p-4">
                            <pre className="text-xs text-green-400 overflow-x-auto">
                              <code>{subjectCode}</code>
                            </pre>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                      >
                        <motion.div
                          className="relative"
                          animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.6, repeat: isAnimating ? Infinity : 0 }}
                        >
                          <div className="w-32 h-32 bg-blue-900 rounded-xl flex items-center justify-center shadow-xl">
                            <Bell className="w-16 h-16 text-white" />
                          </div>
                          <AnimatePresence>
                            {isAnimating && (
                              <>
                                {[...Array(3)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute inset-0 border-4 border-orange-500 rounded-xl"
                                    initial={{ scale: 1, opacity: 0.8 }}
                                    animate={{ scale: 2.5, opacity: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                      duration: 1.5,
                                      repeat: Infinity,
                                      delay: i * 0.5,
                                    }}
                                  />
                                ))}
                              </>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </motion.div>
                    )}

                    <div>
                      <h3 className="text-blue-900 font-semibold">Subject</h3>
                      {/* FIX: Changed text-muted-foreground to a darker color for readability */}
                      <p className="text-gray-700 text-center font-medium">State: {subjectState}</p> 
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={notifyObservers}
                        disabled={isAnimating || observers.length === 0}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Notify All
                      </Button>
                      <Button
                        variant="outline"
                        onClick={reset}
                        className="border-blue-900 text-blue-900 hover:bg-blue-50"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>

                  {/* Observers Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {observers.map((observer, index) => (
                      <motion.div
                        key={observer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card
                          className={`${
                            observer.notified
                              ? 'border-2 border-orange-500 bg-orange-50'
                              : 'border-2 border-slate-200'
                          } shadow-md`}
                        >
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-blue-900 font-medium">{observer.name}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleObserverView(observer.id)}
                                className="h-7 w-7 p-0 text-blue-900 hover:bg-blue-50"
                              >
                                {observer.showCode ? (
                                  <Eye className="w-3 h-3" />
                                ) : (
                                  <Code2 className="w-3 h-3" />
                                )}
                              </Button>
                            </div>

                            {observer.showCode ? (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-slate-900 rounded p-2 overflow-x-auto"
                              >
                                <pre className="text-[8px] text-green-400">
                                  <code>{getObserverCode(observer)}</code>
                                </pre>
                              </motion.div>
                            ) : (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center space-y-2"
                              >
                                <motion.div
                                  animate={
                                    observer.notified
                                      ? {
                                          rotate: [0, -10, 10, -10, 0],
                                          scale: [1, 1.2, 1],
                                        }
                                      : {}
                                  }
                                  transition={{ duration: 0.5 }}
                                >
                                  <User
                                    className={`w-12 h-12 mx-auto ${
                                      observer.notified ? 'text-orange-500' : 'text-slate-400'
                                    }`}
                                  />
                                </motion.div>
                                <p className="text-sm text-muted-foreground">
                                  {observer.notified ? 'Notified' : 'Waiting...'}
                                </p>
                              </motion.div>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeObserver(observer.id)}
                              className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Add Observer */}
                  <Card className="bg-slate-50 border-2 border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label htmlFor="observer-name" className="text-blue-900">
                            Add New Observer
                          </Label>
                          <Input
                            id="observer-name"
                            placeholder="e.g., Push Notification"
                            value={newObserverName}
                            onChange={(e) => setNewObserverName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addObserver()}
                            className="border-slate-300 focus:border-blue-900"
                          />
                        </div>
                        <Button
                          onClick={addObserver}
                          className="mt-auto bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          Add Observer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                // === Push/Pull Demo Mode ===
                <motion.div
                  key="pushpull"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center"
                >
                  <div className="w-full max-w-2xl">
                    <PushPullDemo />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Dynamic Concept Card */}
        <Card className="text-black border-t-1 border-orange-500 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-black">{concepts[currentConcept].title}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevConcept}
                  className="text-blue-900 hover:bg-blue-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextConcept}
                  className="text-blue-900 hover:bg-blue-50"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentConcept}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <CardContent className="space-y-2">
                <p className="font-medium">{concepts[currentConcept].description}</p>
                <div className="space-y-1 text-sm">
                  {concepts[currentConcept].howItWorks.map((line, idx) => (
                    <p key={idx} className={line.includes('Switch') ? 'font-semibold text-orange-600' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </CardContent>
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>

      {/* UML Diagram - Right Side */}
      <div className="lg:col-span-1 border-t-1">
        <div className="sticky top-4">
          <UMLDiagram />
        </div>
      </div>
    </div>
  );
}