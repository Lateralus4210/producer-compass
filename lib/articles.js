// Article content for all 10 Compass areas.
// Each area has three articles: what-is, low-score, high-score.
// Navigation order within an area: what-is → low-score → high-score → (next area)

export const AREA_ORDER = [
  "ideation",
  "composition",
  "music-theory",
  "daw-proficiency",
  "mixing",
  "mastering",
  "collaboration",
  "artwork-content",
  "release-process",
  "promo",
];

// Results page sends users to low-score first; article sequence within each area follows this order.
export const SLUG_ORDER = ["low-score", "what-is", "high-score"];

export const articles = {
  ideation: {
    label: "Ideation",
    "what-is": {
      title: "What Is Ideation?",
      body: [
        "Every piece of music starts somewhere. Before the DAW is open, before the first note is placed, before any decision about sound or structure is made, there's an idea. Or there isn't!",
        "Ideation is the first area of the Compass Skill Tree, and in a lot of ways it's the most foundational. It's not just generating musical ideas in the moment you sit down to create. It's the entire creative ecosystem that makes those ideas possible. The things you consume, the experiences you have, the relationship you maintain with your craft, and the reasons you make music in the first place, are all part of this area.",
        "A producer who has stopped taking in new things has stopped giving their creativity anything to react to. The output reflects the input, and if the input has dried up, the ideas dry up with it.",
        "When Ideation is healthy, making music feels natural. The process feels generative rather than forced. You sit down with a direction or a feeling, and the work flows from there.",
        "When Ideation is struggling, none of that is true. You open your DAW and stare at a blank screen. You start something, abandon it, start something else. Nothing feels worth pursuing. The spark isn't there, and because you don't know why it isn't there, you can't figure out how to get it back.",
        "Do you still enjoy making music? Does sitting down at the DAW feel like possibility or obligation? Have you lost touch with why you started doing this in the first place? A producer who has lost their connection to the joy of making music will struggle to generate ideas no matter how technically skilled they are.",
        "A producer who hasn't seen their friends in three days, who hasn't eaten a proper meal, who has been chained to a desk for forty hours straight, is not going to have good ideas. Creativity requires a life worth drawing from.",
        "One of the most common Ideation killers isn't a lack of ideas — it's the habit of judging ideas too early, and deciding something isn't working before it has had the chance to become something. Good Ideation isn't only about generating ideas, but creating enough safety and space for ideas to exist before they're evaluated.",
      ],
    },
    "low-score": {
      title: "What a Low Ideation Score Looks and Feels Like",
      body: [
        "A producer with a struggling Ideation score often can't immediately identify why they're stuck. The problem doesn't announce itself clearly. It just shows up as a consistent inability to get started, or a pattern of starting things and abandoning them before they go anywhere.",
        "They may have stopped consuming new music or art gradually, not necessarily deliberately. Life got busy. They kept listening to the same things. The well started running dry without them noticing.",
        "They may have lost touch with why they make music. The joy that was once automatic now has to be manufactured. The DAW feels like a task rather than a playground. They sit down because they think they should, not because they can't wait to.",
        "They may be physically and emotionally depleted. Overworked, undersocialized, running on empty. The creative output reflects the state of the whole person, and the whole person needs attention.",
        "They may be in the habit of killing ideas before they're born. They start something, decide it isn't good enough, and start over. Or they don't start at all, because the inner critic has already decided that whatever emerges won't be worth the effort.",
        "In Compass, a low Ideation score is never treated as a sign that someone isn't creative. It's treated as a signal that something in the creative ecosystem needs attention. Sometimes that's as simple as curated listening homework or an exposure exercise. Sometimes it goes deeper, all the way back to the question of why you started making music in the first place, and whether that reason still lives in you. That conversation is always worth having. And it's always a place to start.",
      ],
    },
    "high-score": {
      title: "What a High Ideation Score Looks and Feels Like",
      body: [
        "A producer with a strong Ideation score has a rich and active creative life that extends well beyond the DAW.",
        "They consume voraciously, whether it be new music across genres they don't normally work in, films, books, live performances, art. They're always feeding the well. When they sit down to create, they have something to react to, something to draw from, a perspective to bring.",
        "They have a clear and living sense of why they make music. They can point to the thing that sparked their journey and trace a line from there to where they are now. Their origin story isn't simply their history, but their fuel to keep going.",
        "They have systems for capturing ideas before they disappear, be it a voice memo habit, a dedicated folder, or notes app. They have some way of collecting the fragments that arrive unexpectedly. They know that inspiration is unpredictable and they've built infrastructure to catch it when it shows up.",
        "They understand the relationship between rest and creativity. They know when to push and when to step back. They take the desk detox when they need it without guilt, because they've learned that walking away is sometimes the most productive thing they can do.",
        "And when they sit down to create, they start with what inspires them. They run with what actually excites them right now, not with what seems logical or what they think they should do. They've learned that inspiration does the heavy lifting if you let it.",
      ],
    },
  },

  composition: {
    label: "Composition",
    "what-is": {
      title: "What Is Composition?",
      body: [
        "If Ideation is where the spark comes from, Composition is where the spark becomes something.",
        "It's the process of taking a raw idea and making decisions about it. What notes? What structure? Where does it go from here? How does it grow, breathe, build, and resolve? Composition is every choice you make in shaping a musical idea into something that resembles a finished piece of music.",
        "Of all the ten areas in the Compass Skill Tree, this one has the most natural overlap with the others. Interconnectedness is the point of the framework. A Compass score isn't a verdict on ten separate skills. It's a map of a living, breathing creative process where everything affects everything else.",
        "Composition just happens to sit right at the center of that web.",
        "Composition covers the full range of musical decision-making that happens between having an idea and having a finished arrangement.",
        "It covers how a piece of music moves from beginning to end in its structure. A producer who struggles with structure often gets stuck in loops, with strong eight bar ideas that they can't develop further because they don't have a framework for what comes next.",
        "It addresses the development of a musical phrase that has identity, intention, and direction. A melody that works has a shape. It goes somewhere. It repeats in a way that feels intentional rather than lazy, and varies in a way that feels surprising rather than random.",
        "How the notes and chords you choose relate to each other and to the key you're working in is harmony. This is where Composition and Music Theory become almost inseparable. You don't need to be a theory expert to compose well, but a basic understanding of how harmonic elements interact will save you from clashing sounds.",
        "It covers arrangement, or how the individual elements of a piece relate to each other spatially and temporally. Which element has the spotlight at any given moment, and how density and space are used to create contrast and movement.",
        "And it covers the meta-skill of knowing when something is done. The ability to recognize when a composition has said what it needs to say and doesn't need anything more is one of the hardest and most valuable things a producer can develop.",
      ],
    },
    "low-score": {
      title: "What a Low Composition Score Looks and Feels Like",
      body: [
        "A producer with a struggling Composition score often knows something is wrong but can't pinpoint what.",
        "The most common presentation is the loop trap, with a strong initial idea that never goes anywhere. They make something exciting in the first eight bars and then spend hours, sometimes days, trying to figure out what comes next.",
        "Melodic problems show up in a few different ways. Some producers write melodies that meander, and never settle on a phrase, never repeat anything, never give the listener something to hold onto. Others write melodies that feel flat or directionless. Others still write something that sounds fine on its own but somehow doesn't work in context.",
        "Harmonic clashes are one of the most immediately audible signs of a Composition struggle, especially for producers who work heavily with samples. When elements are pitched without checking whether they're compatible, the result is a muddiness or tension that doesn't feel intentional.",
        "Arrangement problems often masquerade as mixing problems. A producer will send a track for feedback convinced that the mix is the issue, when the real problem is that every element is playing all the time at the same density and there's no room for anything to breathe.",
        "In Compass, a low Composition score is an invitation to go back to basics. Sometimes the most powerful thing you can do is strip a track down to its three most essential elements and rebuild from there.",
      ],
    },
    "high-score": {
      title: "What a High Composition Score Looks and Feels Like",
      body: [
        "A producer with a strong Composition score has a clear and confident relationship with musical decision-making.",
        "They can take an idea and develop it. An eight bar loop doesn't stay an eight bar loop because they know how to introduce a B section, build tension, create a drop, or strip things back. They have a repertoire of structural moves that they can apply instinctively, even if they couldn't articulate the theory behind them.",
        "Their melodies have identity. You could hum them after one listen. They repeat enough to feel familiar and vary enough to feel alive. When something in the melody isn't working, a high Composition producer isolates it, diagnoses it, and fixes the specific thing that's off.",
        "They think in layers and relationships rather than in isolated parts. They understand that none of the individual elements are the song. The song is what happens between them. They make decisions about what each element's role is and hold that role consistently through the arrangement.",
        "They have a healthy relationship with limitations. They don't need fifty tracks to make something compelling. They know how to do more with less, and they're not afraid of space.",
        "Most importantly, they know when to stop. They have an internal signal that tells them when a composition has arrived somewhere worth keeping, and they trust it enough to move on.",
      ],
    },
  },

  "music-theory": {
    label: "Music Theory",
    "what-is": {
      title: "What Is Music Theory?",
      body: [
        "You do not need to know music theory to make great music. Some of the most innovative and emotionally resonant music ever made came from people who couldn't name a single chord or tell you what key they were working in. Feeling, instinct, and a good ear have always been, and will always be, legitimate paths to compelling music.",
        "So when we talk about Music Theory as an area of the Compass Skill Tree, we're not talking about a prerequisite you need to check off before you're allowed to call yourself a real producer. We're talking about a set of tools. Tools that, when you understand them, give you more options. More ability to execute the thing you're hearing in your head. And tools that, when you over-rely on them, can actually get in the way of the music.",
        "Theory is a means to an end, not the end itself. The goal is always the music and how it feels, what it communicates, whether it moves the person listening to it. Theory exists to serve that goal. The moment it starts overriding your ear, your instinct, or your emotional response to what you're making, it has stopped being useful.",
        "Know enough to serve the music. No more, no less.",
        "In the context of the Compass Skill Tree, Music Theory covers the working knowledge of harmony, rhythm, and melody that directly affects the music you're making.",
        "It covers the foundational building blocks of intervals, scales, keys, and how they relate to each other. Not as abstract concepts to memorize, but as practical tools for understanding why two elements work together or why they don't.",
        "Why does that chord feel tense? Why does that one feel like resolution? Understanding chord function doesn't require years of classical training. It requires enough awareness to make intentional harmonic decisions rather than accidental ones.",
        "It covers rhythm and how it interacts with melody and harmony. How the timing of notes creates or releases tension, how syncopation works, how a rhythmic choice can completely change the emotional character of a melodic line.",
        "It covers the ability to hear what's happening in your music and in music you're studying. Ear training isn't a separate discipline from theory. It's the practical application of it, and for most producers it's where the real development happens.",
        "And it covers the concept of enough. Knowing when your theory knowledge is serving the music and when it's getting in the way. Knowing that the question 'does this work theoretically?' is always less important than 'does this work?'",
      ],
    },
    "low-score": {
      title: "What a Low Music Theory Score Looks and Feels Like",
      body: [
        "A low Music Theory score shows up in a few very different ways, and it's important to distinguish between them because the interventions are different depending on what's actually happening.",
        "The first presentation is a foundational gap, or a producer who genuinely doesn't know the basics. They don't know what an interval is, how a scale is built, or why certain notes work together and others don't. This is a gap in knowledge that can be filled with the right resources and a little focused attention.",
        "The second presentation is an ear problem, or a producer who may have some theoretical knowledge but can't hear it in practice. This is less a theory problem and more a listening problem, and the intervention is ear training rather than more theory study.",
        "The third presentation is the opposite of what you might expect, which is a producer who knows too much theory, or more accurately, who has let theory override their ear. They get so caught up in whether something is theoretically correct that they stop trusting what actually sounds good. This is one of the subtler theory struggles, and it's worth naming because it's more common than people realize.",
        "In Compass, the Music Theory work is always applied rather than academic. We're not interested in whether you can pass a theory exam. We're interested in whether your theoretical knowledge, regardless of level, is actually serving the music you're trying to make. That's the only question that matters.",
      ],
    },
    "high-score": {
      title: "What a High Music Theory Score Looks and Feels Like",
      body: [
        "A producer with a strong Music Theory score isn't necessarily someone who can write out a circle of fifths from memory or analyze a Bach chorale. In the Compass context, a high score means something more practical and more musical than that.",
        "It means their ear and their knowledge are working together. They can sit down with a piece of music they're writing and hear when something is harmonically off and identify it specifically enough to fix it.",
        "It means they make intentional harmonic choices. When they use a particular chord or scale, they have a reason, even if that reason is purely emotional rather than technical.",
        "It means they can work fluently in their genre's theoretical language. A high theory score doesn't mean knowing everything, but knowing what's relevant to what you make and being genuinely fluent in that specific territory.",
        "It means their theory knowledge expands their options without limiting their instincts. They can hear something in their head, understand what it is theoretically, and execute it. But they can also ignore theory entirely when the ear says something works, even if the theory says it shouldn't.",
        "And it means they have a healthy relationship with modes, extended chords, and other more advanced concepts, meaning they use them when they serve the music and leave them alone when they don't.",
      ],
    },
  },

  "daw-proficiency": {
    label: "DAW Proficiency",
    "what-is": {
      title: "What Is DAW Proficiency?",
      body: [
        "Just as a guitarist develops a relationship with their guitar over years of playing, a producer develops a relationship with their digital audio workstation over years of making music in it. The shortcuts become muscle memory. The workflow becomes instinct. The tool stops feeling like a tool and starts feeling like an extension of the creative process itself.",
        "That relationship takes time to build. And the single most important thing we can tell you about DAW Proficiency before anything else is this: the best DAW is the one you know how to use. The one that, when you open it, gets out of your way and lets you make music.",
        "Every DAW is a legitimate, capable tool that has been used to make incredible music. The differences between them are differences of workflow, interface, and personal preference, not capability. You need to build a genuine, fluent, confident relationship with whatever tool you've chosen.",
        "DAW Proficiency covers your practical command of your tools and your workflow. How efficiently and confidently can you execute your musical ideas inside your chosen software?",
        "It covers the fundamentals — MIDI, audio, routing, automation, and mixing chains. These are universal principles that apply across every major platform. A producer who understands them in one DAW will find them familiar in any other.",
        "How you move through a session from blank canvas to finished track is your workflow. A producer with a strong workflow can execute ideas quickly enough that the ideas don't slip away before they're captured. A producer with a weak workflow spends half their creative time fighting the software instead of making music.",
        "The unsexy but critically important business of keeping your sessions, files, folders, and mixer tracks clean, labeled, and structured is tantamount. Disorganization is one of the most common and most underestimated obstacles to productivity in music production.",
        "It covers templates, or pre-built session structures that let you skip the setup and get straight to creating, removing the friction between having an idea and being able to execute it.",
        "And it covers the meta-skill of knowing your own limits and knowing when your current tool might be working against you. Sometimes a DAW's workflow is genuinely incompatible with how a producer thinks and works. In those cases, switching to a different tool is making a smart decision about where to invest your time and energy.",
      ],
    },
    "low-score": {
      title: "What a Low DAW Proficiency Score Looks and Feels Like",
      body: [
        "A low DAW Proficiency score presents differently depending on where a producer is in their journey, and it's worth recognizing that the archetypes are meaningfully different from each other.",
        "The first is the overwhelmed beginner. They're new to their DAW and the sheer volume of options, menus, plugins, and settings is genuinely paralyzing. Familiarity comes with time and repetition. The intervention is simple: stop trying to learn everything and start making something.",
        "The second is the slow intermediate. They know their way around the software well enough to function, but their workflow has never been properly optimized. They spend time hunting for plugins they use constantly. Their mixer is a mess of unlabeled channels. They can make music, it just takes longer than it should.",
        "The third is the disorganized veteran. They've been using their DAW for years and know it deeply. But somewhere along the way they never built the organizational habits that would let that knowledge scale. Technical fluency without organizational discipline is a ceiling, and a lot of experienced producers hit it without knowing why.",
        "In Compass, DAW Proficiency work always starts with an honest assessment of which archetype is presenting and what that producer specifically needs. Because the beginner who needs to just open the software and start making sounds needs something completely different from the veteran who needs to spend a session doing nothing but reorganizing their workflow.",
      ],
    },
    "high-score": {
      title: "What a High DAW Proficiency Score Looks and Feels Like",
      body: [
        "A producer with a strong DAW Proficiency score has a relationship with their software that feels almost invisible.",
        "They don't think about how to do things. They just do them. The shortcuts are automatic. The signal chain is familiar. The organizational system they've built means they can find anything in seconds. When an idea arrives, they can capture it without the software slowing them down.",
        "They have templates, and probably more than one. Those templates reflect years of refinement and self-knowledge. They load a session and feel at home immediately, ready to create rather than ready to set up.",
        "They understand their DAW well enough to know what it can and can't do, and they've found solutions or workarounds for the limitations that matter to them. They've made peace with it, worked within its logic, and built a workflow that suits them specifically.",
        "They know the 20% of their DAW's features that account for 80% of their actual workflow. They're not trying to use every feature. They've identified the ones that matter for what they make and gotten genuinely good at those.",
        "And they get excited when they open their DAW. The blank canvas of a new session feels like possibility rather than obligation. That relationship with the tool and a recognition of it as a place where things get made is one of the clearest signs of genuine DAW Proficiency.",
      ],
    },
  },

  mixing: {
    label: "Mixing",
    "what-is": {
      title: "What Is Mixing?",
      body: [
        "Mixing is where your music stops being a collection of parts and starts being a cohesive whole.",
        "It's the process of taking every element you've composed and arranged and shaping them into something that exists together in a shared sonic space. Where each element sits in the frequency spectrum. How loud each thing is relative to everything else. How much space and depth and width the overall picture has.",
        "It is both a technical discipline and a creative one. There are foundational practices and tools that every producer needs to understand, but beyond that floor of fundamentals, mixing is deeply, irreducibly subjective. There is no objectively correct mix. There is only a mix that serves the music, serves the listener, and serves the context the music is going to live in. And the only reliable guide to whether you've achieved that is your ear. It's not your meters, your spectrum analyzer, or a loudness target someone told you to hit.",
        "Mixing covers the full process of balancing, shaping, and spatially placing the elements of a track so that they work together rather than against each other.",
        "The most fundamental and most underrated tool in the entire mixing process is leveling. Before you touch a single plugin, getting your levels right is the work. Most of the progress in any mix can come from simply making some things louder and some things quieter. Leveling before everything else is a discipline that the best mixers in the world practice religiously.",
        "It covers EQ and shaping the frequency content of individual elements so that each one occupies its own space in the spectrum. A muddy mix is almost always a frequency problem. EQ is how you carve out space and give each element room to be heard.",
        "It covers compression, or management of dynamic range within individual elements and across the mix as a whole. Compression done well preserves the life and energy of a performance while taming the peaks that cause problems. Compression done badly flattens a mix into something that sounds loud on paper and lifeless in practice.",
        "It covers spatial tools — reverb, delay, stereo width — and the way they're used to create a sense of depth and dimension. Reverb makes things sound farther away. Delay adds space and movement. Used intentionally, these tools create the illusion of a real acoustic space. Used carelessly, they turn a mix into a wash of indistinct blur.",
        "It covers transient management and the handling of the sharp initial peaks that give percussion and other elements their punch and definition. And it also covers the behavioral dimension — the decisions about when to keep working and when to stop.",
      ],
    },
    "low-score": {
      title: "What a Low Mixing Score Looks and Feels Like",
      body: [
        "A low Mixing score is one of the most varied presentations in the entire Compass Skill Tree, because the gap between 'needs technical fundamentals' and 'needs to trust their ear more' is enormous.",
        "On the technical side, the most common issues show up clearly and audibly. Levels that are all over the place. Frequency buildup and muddiness in the low and low-mid range. Elements that sound isolated and dry because they've never been given any spatial treatment. These are fixable problems with clear solutions.",
        "On the behavioral side, the most common issue is perfectionism. A producer who spends weeks on a single mix isn't being rigorous. They're avoiding the finish line. Every hour past the point of diminishing returns is an hour not spent making the next track.",
        "Ear fatigue compounds both of these problems. A producer who has been listening to the same mix for eight hours straight is not hearing it clearly anymore. Walking away and coming back is one of the most productive things a mixer can do.",
        "And then there's the over-reliance on metrics. A producer who is obsessed with hitting a specific loudness target at the expense of what the music actually sounds like has let a tool override the ear it was meant to serve.",
      ],
    },
    "high-score": {
      title: "What a High Mixing Score Looks and Feels Like",
      body: [
        "A producer with a strong Mixing score has a clear and confident process that they move through with intention rather than anxiety.",
        "They level first. Always. They know that the foundation of any good mix is balance, and they build that balance before they reach for any processing.",
        "They understand the technical fundamentals well enough that they're not thinking about them consciously. Gain staging, frequency management, compression ratios, and reverb tails are all second nature.",
        "Their ear is their primary instrument. They A/B at matched volumes so they're evaluating their mixing decisions rather than just responding to whatever is louder. They trust what they hear over what the meters say, while monitoring the numbers for context but never letting them override a clear sonic judgment.",
        "They understand that mixing and mastering serve different purposes. Mixing makes the elements within a track feel cohesive. Mastering makes multiple tracks feel cohesive as a body of work and makes them competitive against professionally made tracks.",
        "And they know when they're done. A producer with genuine mixing maturity has an internal signal that tells them when a mix has arrived somewhere worth keeping, and they trust it enough to stop. They don't spend a hundred hours on a three minute track.",
      ],
    },
  },

  mastering: {
    label: "Mastering",
    "what-is": {
      title: "What Is Mastering?",
      body: [
        "Mastering is the most misunderstood area in the entire Compass Skill Tree, because a significant number of producers don't actually know what mastering is for.",
        "Mixing makes the elements within a single track feel cohesive with each other. Mastering makes multiple tracks feel cohesive with each other as an EP, an album, a body of work. It's the final stage of audio processing, applied not to individual tracks but to the stereo mix as a whole, with the goal of preparing that mix for the world.",
        "It starts with listening. Not processing. A mastering pass that begins with someone reaching immediately for a compressor or a limiter is a mastering pass that's already off track. The first job of mastering is to hear the mix clearly.",
        "It covers broad tonal shaping, and subtle EQ moves applied to the full mix to address any overall frequency imbalances that survived the mixing stage. Not dramatic cuts and boosts but gentle, considered adjustments that help the track translate across different playback systems.",
        "It covers dynamic processing, or compression and limiting applied to the master to manage the overall dynamic range of the track. Trust your ear over your meters. Push the track as close to 0dB as you can without clipping or squashing the life out of it, and stop when it starts sounding worse, not when a meter tells you to stop.",
        "It covers transient management and ensuring that the peaks in your master are handled in a way that allows proper normalization. Getting your transients under control before the limiter is foundational mastering practice.",
        "It covers cohesion across a body of work and ensuring that track two doesn't sound dramatically louder or brighter or thinner than track one, that the listening experience of moving through an EP or album feels intentional and unified. This is the most distinctly mastering-specific skill.",
      ],
    },
    "low-score": {
      title: "What a Low Mastering Score Looks and Feels Like",
      body: [
        "A low Mastering score almost always begins with a conceptual problem rather than a technical one.",
        "The most common presentation is a producer who treats mastering as an extension of mixing. They're still reaching for individual track processing at the mastering stage, still trying to fix mix problems that should have been addressed before the stems were bounced.",
        "The second most common presentation is an obsession with loudness targets, or a producer who has learned that streaming platforms have loudness specifications and has concluded that hitting those targets is the primary goal of mastering. This leads to over-compression, squashed dynamics, and music that sounds technically compliant and emotionally flat.",
        "A third presentation is the producer who doesn't master at all. This is someone who bounces their mix and uploads it directly to a distributor without any final processing. More often this results in a track that sounds noticeably quieter and thinner than the professional releases it's sitting next to on a playlist.",
        "And then there's the producer who understands mastering conceptually but hasn't developed the ear for it yet. This is a maturity issue, and an acknowledgment that mastering ears take time to develop.",
        "We believe it's always grounded in the ear rather than the meter. The north star is always the same: does this sound right? Does it feel alive? Does it serve the music? If yes, you're done. And knowing when you're done is half the battle.",
      ],
    },
    "high-score": {
      title: "What a High Mastering Score Looks and Feels Like",
      body: [
        "A producer with a strong Mastering score has a clear and confident understanding of what mastering is for, and that understanding shapes everything about how they approach it.",
        "They come to the mastering stage with fresh ears. They know that the worst thing they can do is move directly from a long mixing session into mastering the same track. They give themselves distance so they can hear the mix the way a first-time listener will.",
        "They listen before they process. They play the track through from start to finish without touching anything, paying attention to what they actually hear. And sometimes what it tells them is that it needs less than they thought.",
        "Their processing is subtle and intentional. A high mastering score isn't demonstrated by a heavily processed chain but by the wisdom to know when less is more.",
        "They trust their ear over their meters. They check the numbers because those numbers matter for release. But they never let a number override what they're actually hearing.",
        "They can make a body of work feel unified. Put their tracks back to back and they flow together. The tonal balance is consistent. The loudness is consistent. The listener moves from track to track without any jarring shifts in level or character.",
      ],
    },
  },

  collaboration: {
    label: "Collaboration",
    "what-is": {
      title: "What Is Collaboration?",
      body: [
        "Making music alone is powerful. There's a purity to it as the unmediated translation of your inner world into sound, answerable to nobody, shaped entirely by your own vision and instinct.",
        "But making music with other people is something else entirely. It introduces friction, and surprise, and perspective you couldn't have generated on your own. It pushes your work into territory you wouldn't have found alone.",
        "Collaboration is the seventh area of the Compass Skill Tree, and it's one of the most underestimated. Most producers think of it narrowly, as working with another producer, co-writing a song, splitting stems and trading sessions.",
        "In the Compass framework, Collaboration covers every relationship in your creative ecosystem that requires you to work with another person toward a shared creative goal. That includes other producers and musicians, yes. But it also includes the mix engineer you send your stems to. The visual artist who makes your cover art. The photographer who shoots your press photos. The venue you're trying to book. The bandmates who depend on you. The family members whose support makes your creative life possible.",
        "Collaboration covers the full range of interpersonal skills, habits, and awareness that determine how effectively you work with other people in your creative life.",
        "It covers knowing where to look for people whose skills complement yours, how to approach them in a way that feels genuine rather than transactional, and how to initiate a creative relationship without the awkwardness of treating another artist like a resource to be acquired.",
        "It covers the ability to articulate your creative vision to people who may not share your musical language. Talking to another producer is a completely different conversation from talking to a graphic designer about what your album cover should feel like.",
        "Productive collaboration doesn't require you to abandon your creative identity. It requires you to hold it with enough confidence and enough flexibility that another person's contribution feels like an addition rather than a threat.",
      ],
    },
    "low-score": {
      title: "What a Low Collaboration Score Looks and Feels Like",
      body: [
        "A low Collaboration score is one of the most emotionally layered struggles in the Compass framework, because the barriers here are rarely about lack of knowledge or skill. They're about fear, ego, and the specific vulnerability of inviting another person into something you care deeply about.",
        "The first and most common presentation is isolation. A producer who makes music entirely alone, not because they prefer it philosophically, but because the prospect of working with someone else feels too risky and exposing.",
        "The second presentation is ego in the collaborative space, or a producer who technically collaborates but struggles to share creative control in good faith. They invite input but don't really want it. This is a natural response to caring deeply about something. But it does need to be named and worked through.",
        "The third presentation is not knowing where to find people or how to approach them. This is the most practically solvable of the three. There are specific places where genuine creative connections happen, and there are specific ways of approaching potential collaborators that feel human rather than transactional.",
        "The fourth presentation is a producer who knows what they want but can't translate it into language another person can act on.",
        "In Compass, Collaboration work starts with an honest mapping of a producer's current ecosystem, stating who is in it, what those relationships look like, and where the gaps and friction points are.",
      ],
    },
    "high-score": {
      title: "What a High Collaboration Score Looks and Feels Like",
      body: [
        "A producer with a strong Collaboration score moves through their creative ecosystem with a kind of interpersonal fluency that makes everything easier.",
        "They have a genuine network of real relationships with people they've worked with, supported, and been supported by. Those relationships exist because they've invested in them genuinely.",
        "They communicate their creative vision clearly and adaptively. They can explain what they're going for to a graphic designer, a mix engineer, a venue booker, or a bandmate, and they can adjust their language and framing depending on who they're talking to.",
        "They hold their creative identity with confidence and flexibility at the same time. They know what they stand for. But they're genuinely curious about what another person brings to the table. They can receive feedback without collapsing and push back without becoming defensive.",
        "They handle the practical side with professionalism. Split sheets are agreed on early. Expectations are set clearly. They treat collaborative relationships with the same respect and care they'd want extended to them.",
        "And they understand collaboration broadly. They recognize the visual artist, the engineer, the supportive partner, and the honest friend as collaborators. They tend to those relationships with intention.",
      ],
    },
  },

  "artwork-content": {
    label: "Artwork & Content",
    "what-is": {
      title: "What Is Artwork & Content?",
      body: [
        "Unfortunately, the music alone is not enough.",
        "In a world where hundreds of thousands of songs are uploaded to streaming platforms every single day, the music is the starting point. The people who find your music, connect with it, and keep coming back for more almost never discover it because they went looking for new music. They discover it because they discovered you first.",
        "People don't follow music. They follow people. They follow artists. They follow the human being behind the sound, and the personality, the perspective, the life that the music comes from. And the way they find that human being is through the content and visual identity that exists around the music.",
        "Artwork and Content is the eighth area of the Compass Skill Tree, and it sits at the intersection of creative identity and professional visibility. It's not about becoming a content creator in the social media sense, but understanding that the work of being an artist in the world includes showing up visibly and authentically.",
        "The first aspect of this area is visual identity, or the aesthetic language through which your music is represented visually in the world. Cover art, artist photos, color palette, typography, overall look and feel across platforms. Before a single note is heard, a potential listener is already forming an impression based on how it looks.",
        "Strong visual identity doesn't require a professional design budget. It requires consistency, intentionality, and a clear sense of what your music stands for. Public domain artwork is a rich and underutilized resource. Free tools like GIMP and Canva are genuinely capable of producing compelling artwork when used with taste and intention. And when budget allows, supporting visual artists through paid commissions or creative trades often produces the best results.",
        "The second dimension is content. This is where a lot of producers freeze up, because they've internalized a version of content creation that feels inauthentic and exhausting.",
        "Content doesn't have to feel like content. The most effective content isn't the most polished or the most strategic. It's the most human. A sixty second video of the sky on a walk with your music underneath it. Your dog doing something absurd. A moment of genuine vulnerability about a struggle in your creative life.",
        "It also covers the social media audit, which is the practice of actually looking at your existing content with honest eyes, identifying what has resonated and what hasn't, and understanding why.",
      ],
    },
    "low-score": {
      title: "What a Low Artwork & Content Score Looks and Feels Like",
      body: [
        "A low Artwork and Content score is one of the most common struggles in the Compass Skill Tree, and it's almost never about a lack of creativity.",
        "The most common presentation is avoidance rooted in discomfort. The producer knows they should be more visible. But the act of posting and putting themselves out there feels uncomfortable in a way that's hard to articulate.",
        "The second presentation is a content identity crisis, or a producer who doesn't know what to post because they don't know how to present themselves. They've absorbed the idea that their social media presence needs to be a carefully curated brand, and the pressure of that curation has paralyzed them.",
        "The antidote to both of these is the same: permission. Permission to be a real person. Permission to post the sky and the dog and the half-finished track and the moment of doubt. The producers who build the most genuine followings aren't the ones with the most polished content strategy. They're the ones who showed up as themselves consistently enough that people had a reason to stick around.",
        "The third presentation is visual inconsistency in the form of cover art that doesn't feel connected to anything, a social media presence that looks like it belongs to three different artists.",
        "In Compass, Artwork and Content work starts with a simple question: what are you comfortable sharing?",
      ],
    },
    "high-score": {
      title: "What a High Artwork & Content Score Looks and Feels Like",
      body: [
        "A producer with a strong Artwork and Content score has a visible creative presence that feels like a natural extension of who they are and what their music is about.",
        "Their visual identity is coherent. Their cover art, their artist photos, and their social media presence all feel like they belong to the same world. A new listener who finds their music on Spotify and then looks them up on Instagram doesn't encounter a jarring disconnect.",
        "Their content feels effortless even when it isn't. They've found the things about their life and personality that they're comfortable sharing, and they share them consistently without agonizing over every post. They document rather than perform.",
        "They understand the difference between promotion and connection. They post about their music, yes, but that's a small fraction of what they share. Most of what they put out is simply themselves, living their life, making their work, being a person.",
        "They've developed a genuine intuition for what resonates through paying attention over time to what sparks conversation and what makes people feel something.",
        "And they support the visual artists in their ecosystem. They commission artwork when they can. They credit the people who help them. They treat the visual dimension of their work as a genuine creative collaboration.",
      ],
    },
  },

  "release-process": {
    label: "Release Process",
    "what-is": {
      title: "What Is the Release Process?",
      body: [
        "Everything you've done up to this point — the ideation, the composition, the mixing, the mastering — has been in service of this moment. The moment when the thing you made stops being yours alone and becomes available to the world.",
        "That moment is terrifying for a lot of producers. And that terror is one of the primary reasons why so much music never makes it out of the folder it was made in.",
        "The Release Process is the ninth area of the Compass Skill Tree, and it covers both the practical and the psychological dimensions of getting music into the world. In our experience, the practical side is almost never the real obstacle. Most producers can figure out how to upload a track to a distributor. What they can't always figure out is how to let go of it.",
        "On the practical side, Release Process covers everything that happens between a finished, mastered track and that track being live on streaming platforms and available to listeners.",
        "It starts with distribution and understanding how music gets from your hard drive to Spotify, Apple Music, and the dozens of other platforms where listeners find new music. Understanding how to use distributors, what they require, and what choices you're making when you upload is foundational release knowledge that every producer needs.",
        "It covers the information attached to your music that determines how it's categorized, discovered, and attributed. Your artist name, the track title, the genre tags, the release date, your ISRC codes. Metadata is how streaming algorithms understand what your music is and who to show it to.",
        "It covers the release timeline and the process of working backwards from a release date to ensure that everything that needs to happen before the music goes live actually happens in time. Most platforms require minimum lead time. Pitching to editorial playlists on Spotify requires submission at least seven days before release.",
        "And on the psychological side, Release Process covers the internal work of actually being able to let go. The most damaging belief in this area is one that's almost universally held and almost universally wrong: if I make the music and release it, people will come. They won't. Not automatically. Understanding this early saves enormous amounts of disappointment and misplaced self-doubt.",
        "The second most damaging belief is that the music needs to be perfect before it can go out. It doesn't. It never will be. Perfection in music is a myth and an excuse that keeps music on hard drives instead of in the world.",
      ],
    },
    "low-score": {
      title: "What a Low Release Process Score Looks and Feels Like",
      body: [
        "A low Release Process score almost always has a psychological root even when it presents as a practical problem.",
        "The most common presentation is the folder full of finished or nearly finished music that has never been released. Every producer who has ever been serious about making music has some version of this folder. The question is whether the folder is growing faster than the release catalog.",
        "The second presentation is the release that almost happened. The track that was uploaded, scheduled, and then pulled back at the last minute because something didn't feel right. This kind of behavior is worth examining honestly, because it's almost never about the music and almost always about the fear of being heard.",
        "The third presentation is practical overwhelm, embodied by a producer who genuinely doesn't know how the distribution process works, what metadata means, or how to get their music onto platforms correctly. Once the process is demystified, releasing becomes significantly less daunting.",
        "The fourth presentation is the producer who releases but does so haphazardly with no consistent artist name, incomplete metadata, backdated releases that don't trigger new-release algorithms. Their music is technically out in the world but working against itself in ways they can't see.",
        "In Compass, Release Process work always begins with an honest inventory. What's in the folder? What's stopped it from coming out? From there, the work is specific — a distributor walkthrough, a release planning call, sometimes a deadline set on the call itself. Your fans are out there. Release the music. Make more. Release that too.",
      ],
    },
    "high-score": {
      title: "What a High Release Process Score Looks and Feels Like",
      body: [
        "A producer with a strong Release Process score has developed a healthy, functional, and consistent relationship with finishing and releasing music.",
        "They have a system. A release checklist that they work through every time. A folder structure that keeps their assets organized. A relationship with a distributor that they understand well enough to navigate without stress.",
        "They set release dates and honor them. They understand that the deadline is what transforms a piece of music from a work in progress into a finished thing, and they've made peace with the fact that the finished thing will never be exactly what the ideal version in their head was.",
        "They release consistently. Not necessarily frequently, but with enough regularity that releasing feels like a natural part of their creative rhythm rather than a special occasion.",
        "They understand their metadata and take it seriously. They know what genre tags to use, how to format their artist name consistently, why ISRC codes matter, and what a backdated release date does to their discoverability.",
        "And they've made peace with letting go. They've learned, through experience, that the music does more good in the world than it does on their hard drive.",
      ],
    },
  },

  promo: {
    label: "Promo",
    "what-is": {
      title: "What Is Promo?",
      body: [
        "If you want your music to reach people who don't already know you exist, you have to do something about it. That's not a cynical observation, but the reality of making music in the world right now. And the sooner you make peace with it, the sooner you can get to the actually interesting question: not whether to promote, but how to do it in a way that feels authentic, sustainable, and genuinely yours.",
        "Promo is the tenth and final area of the Compass Skill Tree. It's where everything you've built across the other nine areas meets the world. And in a very real sense, it's the area that determines whether any of the rest of it actually reaches anyone.",
        "Promo covers the full range of activities, habits, and strategies through which you make your music discoverable and build a genuine audience around it.",
        "It starts with presence, which is the ongoing, consistent act of showing up in public as an artist. Not with a formal marketing strategy, but as a real person who makes music and is willing to let the world see that.",
        "A social media presence that is purely promotional creates almost no genuine connection with anyone. A social media presence that shows the person behind the music, and the life the music comes from, creates the kind of connection that turns casual listeners into genuine fans. The most effective content doesn't feel like content. It feels like a window into a real person's life.",
        "It covers playlist pitching and the process of submitting your music to playlist curators on streaming platforms and beyond. A good pitch isn't a form letter. It's a specific, human conversation about why this particular music belongs in this particular playlist.",
        "It covers press and blog outreach and the process of getting your music written about and reviewed by publications that cover your genre. It covers sync licensing, which is one of the most viable and underexplored revenue streams available to independent artists.",
        "And it covers community, or the network of genuine relationships with other artists, fans, collaborators, and industry people that forms organically when you show up consistently and authentically. Word of mouth is still one of the most powerful discovery mechanisms that exists.",
      ],
    },
    "low-score": {
      title: "What a Low Promo Score Looks and Feels Like",
      body: [
        "A low Promo score is one of the most emotionally loaded struggles in the Compass framework, because Promo is the area that feels most at odds with why most producers started making music in the first place.",
        "The most common presentation is a producer who has released music but done nothing to help anyone find it. They uploaded the track, shared it once on their personal social media, and then waited. When nothing happened, they concluded that nobody was interested, when the reality is that nobody knew it existed.",
        "The second presentation is a producer who shows up in bursts and then disappears. A flurry of posts around a release, then silence for months. This pattern prevents the kind of ongoing connection that turns a casual listener into a genuine fan.",
        "The third presentation is promotional discomfort so acute that it prevents any visibility at all. A producer who genuinely cannot bring themselves to share their music publicly. This is worth examining honestly, because it's almost never about the music and almost always about a deeper fear of being seen.",
        "The fourth presentation is strategic confusion, identified as a producer who wants to promote but doesn't know where to start. They try everything briefly and nothing consistently. They chase the platform that seems to be working for other artists without understanding whether it's right for their music.",
        "The best promotional strategy is the one you'll actually execute consistently over time. Your fans are out there. They exist right now. But they will never find you if you don't give them something to find and help them find it. You've done the work across nine areas of the Compass Skill Tree to make music worth hearing. Promo is the final act of respect you can pay to that work. Show up. Be yourself. Make it findable. The rest will follow.",
      ],
    },
    "high-score": {
      title: "What a High Promo Score Looks and Feels Like",
      body: [
        "A producer with a strong Promo score has a clear, honest, and sustainable relationship with the act of being visible as an artist.",
        "They show up consistently. Not every day necessarily, but with enough regularity that their audience has a reason to keep paying attention. They've found a content cadence that is realistic for their life and their energy.",
        "Their content feels like them. It's not a persona, a performance, or a carefully managed brand identity. It's a real person making music and living a life and being willing to share pieces of both.",
        "They know how to pitch. They understand that a good pitch is specific, personal, and brief. They don't send form letters but extend invitations for conversation. And they accept rejection as part of the process.",
        "They have a genuine community around their work. Other artists who support them, fans who show up for new releases, connections in the industry who think of them when something relevant comes up.",
        "And they understand that Promo is not separate from the music, but an extension of it. The way they present themselves in public, the stories they tell, and the moments they choose to share are all part of the creative work.",
      ],
    },
  },
};

export function getArticle(area, slug) {
  return articles[area]?.[slug] ?? null;
}

export function getNextArticle(area, slug) {
  const slugIdx = SLUG_ORDER.indexOf(slug);
  if (slugIdx < SLUG_ORDER.length - 1) {
    return { area, slug: SLUG_ORDER[slugIdx + 1] };
  }
  const areaIdx = AREA_ORDER.indexOf(area);
  if (areaIdx < AREA_ORDER.length - 1) {
    return { area: AREA_ORDER[areaIdx + 1], slug: SLUG_ORDER[0] };
  }
  return null;
}
