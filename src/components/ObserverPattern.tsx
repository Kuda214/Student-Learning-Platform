import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Bell, User, Play, RotateCcw, Code2, Eye, ArrowRight, ArrowLeft, Zap, Orbit, Youtube, Volume2, BookOpen } from 'lucide-react';
import { motion, AnimatePresence, color } from 'framer-motion'; // Assuming motion/react is framer-motion based on the syntax
import { UMLDiagram } from './UMLDiagram';

interface Observer {
  id: number;
  name: string;
  notified: boolean;
  showCode: boolean;
}

interface Video {
  id: string;
  title: string;
  youtubeId: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
}




const cppObserverExample = `#include <iostream>
#include <vector>
using namespace std;

class Observer {
public:
    virtual void update(string message) = 0;
};

class ConcreteObserver : public Observer {
    string name;
public:
    ConcreteObserver(string n) : name(n) {}
    void update(string message) override {
        cout << name << " received: " << message << endl;
    }
};

class Subject {
    vector<Observer*> observers;
public:
    void attach(Observer* obs) { observers.push_back(obs); }
    void notify(string msg) {
        for (auto obs : observers) obs->update(msg);
    }
};

int main() {
    Subject subject;
    ConcreteObserver obs1("Observer1"), obs2("Observer2");
    subject.attach(&obs1);
    subject.attach(&obs2);
    subject.notify("Hello Observers!");
    return 0;
}`;


// Helper to calculate top position for the animated dots
const getTopPosition = (i: number) => {
  // Base position + offset per observer (3rem base height, 6rem spacing)
  return 3 * 16 + i * 6 * 16; // Convert rem to pixels (assuming 16px/rem)
};




// === Video Learning Card Component ===
function VideoLearningCard() {
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const videos: Video[] = [
    {
      id: '1',
      title: 'Observer Design Pattern in C++',
      youtubeId: '8QJu74iW9Xk',
      duration: '5:47',
      difficulty: 'Fundamental',
      description: 'In this video, we explore the Observer Design Pattern in C++ — one of the most powerful and commonly used behavioral design patterns.',
    },
    {
      id: '2',
      title: 'Loose vs Tight Coupling',
      youtubeId: 'uWseUdUqM5U',
      duration: '5:36',
      difficulty: 'Intermediate',
      description: 'Loose vs Tight coupling explained in Software engineering with examples.',
    },
    {
      id: '3',
      title: 'Observer Pattern Real-life examples',
      youtubeId: 'wiQdrH2YpT4',
      duration: '9:11',
      difficulty: 'Fundamental',
      description: 'Implementing the Observer pattern and seeing its use in a real life example',
    },
  ];

  const currentVideo = videos[selectedVideoIdx];
  const difficultyColor = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800',
  };

  return (
    <Card className="shadow-lg border-t-1 border-t-purple-400">
      <CardTitle className="text-2xl text-purple-900 p-6">Video Learning Resources</CardTitle>
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="flex items-center gap-2">
          <Youtube className="w-6 h-6" />
          <div>
            <CardTitle className="text-xl text-blue-900">Learn More with Videos</CardTitle>
            <CardDescription className="text-blue-900">
              Watch curated videos to deepen your understanding
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 py-7 space-y-9">


        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full bg-black rounded-lg overflow-hidden h-[650px]"
        >
          <iframe
            width="800px"
            height="350px"
            src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=${isPlaying ? 1 : 0}`}
            title={currentVideo.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full"
          />
        </motion.div>



        {/* Video Info */}
        <motion.div
          key={selectedVideoIdx}
          initial={{ opacity: 0, y: 0.95 }}
          animate={{ opacity: 1, y: 1 }}
          className="space-y-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-blue-900" >{currentVideo.title}</h3>
              <p className="text-sm text-gray-600 mt-1" style={{paddingTop:'15px'}}>{currentVideo.description}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${difficultyColor[currentVideo.difficulty]}`}>
              {currentVideo.difficulty}
            </div>
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1" >
            <Volume2 className="w-3 h-3" />
            Duration: {currentVideo.duration}
          </p>
        </motion.div>

        {/* Video List */}
        <div className="space-y-2" style={{paddingTop:'25px'}}>
          <Label className="text-blue-900 font-semibold flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Available Videos
          </Label>
          <div className="grid gap-2 max-h-64 overflow-y-auto">
            {videos.map((video, idx) => (
              <motion.button
                key={video.id}
                whileHover={{ x: 4 }}
                onClick={() => {
                  setSelectedVideoIdx(idx);
                  setIsPlaying(true);
                }}
                className={`p-3 rounded-lg text-left transition-all ${
                  idx === selectedVideoIdx
                    ? 'bg-purple-100 border-2 border-purple-500 shadow-md'
                    : 'bg-gray-50 border-2 border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{video.title}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <span className="inline-block">▶</span>
                      {video.duration}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${
                    difficultyColor[video.difficulty]
                  }`}>
                    {video.difficulty}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(`https://www.youtube.com/watch?v=${currentVideo.youtubeId}`, '_blank')}
            className="flex-1 border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            Watch on YouTube
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}





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
  const [showParticipantsCode, setShowParticipantsCode] = useState(false);
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
      title: 'The Basic Observer Pattern',
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
      title: 'Observer Pattern Participants',
      description:
        'The Observer pattern participants include the subject, observers, Concrete subjects and Concrete observers.',
      howItWorks: [
        '• The Subject: Maintains a list of observers and notifies them on state changes',
        '• The Observer: Defines an interface for objects that should be notified of changes',
        '• The ConcreteSubject: Implements the Subject interface and stores state of interest',
        '• The ConcreteObserver: Implements the Observer interface and maintains a reference to a ConcreteSubject object',
      ],
    },
    {
      title: 'Push vs. Pull',
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
      title: 'Real-World Example (Event Listeners)',
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



        {/* Dynamic Concept Card */}
        <Card className="text-black border-t-1 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl text-blue-900">Understanding the Observer Pattern</CardTitle>
              
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
                <CardTitle className="text-lg">{concepts[currentConcept].title}</CardTitle>
                <p className="" style={{color:'#8c848c'}}>{concepts[currentConcept].description}</p>
                <div className="space-y-1 text-sm" style={{paddingTop:'13px'}}>
                  {concepts[currentConcept].howItWorks.map((line, idx) => (
                    <p
                      key={idx}
                      className={line.includes('Switch') ? 'font-semibold text-orange-600' : ''}
                    >
                      {line}
                    </p>
                  ))}

                  {/* --- Observer Participants See Code Button --- */}
                  {concepts[currentConcept].title === 'Observer Pattern Participants' && (
                    <div className="mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowParticipantsCode(!showParticipantsCode)}
                        className="mb-2"
                      >
                        <Code2 className="w-4 h-4 ml-2" />
                        {showParticipantsCode ? 'Hide Code' : 'Show Code'}
            
                      </Button>

                      {showParticipantsCode && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-slate-900 text-green-400 rounded-lg p-6 overflow-x-auto"
                        >
                          <pre className="text-xs">
                            <code>{cppObserverExample}</code>
                          </pre>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </motion.div>
          </AnimatePresence>
        </Card>




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

        
        <VideoLearningCard />
      </div>

      {/* UML Diagram - Right Side */}
      <div className="lg:col-span-1 border-t-1 ">
        <div className="sticky top-4">
          <UMLDiagram className="shadow-lg border-t-1" />
        </div>
      </div>
    </div>
  );
}