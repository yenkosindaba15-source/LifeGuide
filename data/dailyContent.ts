export type HomeDailyContent = {
  theme: string;
  verse: string;
  reference: string;
  prayer: string;
};

export type DailyDevotional = {
  theme: string;
  title: string;
  verse: string;
  reference: string;
  message: string;
  prayer: string;
};

export type DailyContent = {
  theme: string;
  home: HomeDailyContent;
  devotional: DailyDevotional;
};

type DailyThemeSource = {
  theme: string;
  title: string;
  verse: string;
  reference: string;
  message: string;
  prayer: string;
};

const createDailyContent = (
  source: DailyThemeSource
): DailyContent => {
  return {
    theme: source.theme,

    home: {
      theme: source.theme,
      verse: source.verse,
      reference: source.reference,
      prayer: source.prayer,
    },

    devotional: {
      theme: source.theme,
      title: source.title,
      verse: source.verse,
      reference: source.reference,
      message: source.message,
      prayer: source.prayer,
    },
  };
};

const dailyThemes: DailyThemeSource[] = [
  {
    theme: "Trust",

    title: "Walking in Faith.",

    verse:
      "Trust in the Lord with all your heart and lean not on your own understanding.",

    reference: "Proverbs 3:5",

    message:
      "Trusting God is not always easy, especially when life feels uncertain. Faith reminds us that we do not need to understand every part of the journey before taking the next step.\n\nToday, place what you cannot control into God's hands. Move forward with faith and trust Him to guide you.",

    prayer:
      "Heavenly Father, help me trust You even when I do not understand what is happening. Give me faith to follow Your direction and place my worries in Your hands. Amen.",
  },

  {
    theme: "Peace",

    title: "Finding Peace.",

    verse:
      "You will keep in perfect peace those whose minds are steadfast, because they trust in You.",

    reference: "Isaiah 26:3",

    message:
      "Peace does not always come from having everything figured out. Sometimes peace begins when we stop trying to control everything and remember that God remains present.\n\nSlow down today. Give your thoughts and worries to God and allow your heart to rest in Him.",

    prayer:
      "Heavenly Father, quiet my thoughts and help me focus on You. Give me peace when life feels uncertain and remind me that I can place every concern into Your hands. Amen.",
  },

  {
    theme: "Courage",

    title: "God Is With You.",

    verse:
      "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",

    reference: "Joshua 1:9",

    message:
      "Courage does not mean that fear never appears. Courage means choosing to move forward while trusting that God is present with you.\n\nWhatever you are facing today, remember that you do not have to face it alone. Take the next step with faith.",

    prayer:
      "Heavenly Father, give me strength and courage when I feel afraid or uncertain. Remind me that I am never alone because You are always with me. Amen.",
  },

  {
    theme: "Surrender",

    title: "Give It to God.",

    verse:
      "Cast all your anxiety on Him because He cares for you.",

    reference: "1 Peter 5:7",

    message:
      "Some worries become heavier because we keep carrying them by ourselves. God invites us to bring those burdens to Him.\n\nYou may not be able to solve everything today, but you can choose what you will place into God's hands. Let surrender become an act of trust.",

    prayer:
      "Heavenly Father, I give my worries and anxieties to You. Thank You for caring for me. Help me trust You and find peace in Your presence. Amen.",
  },

  {
    theme: "Strength",

    title: "Strength for Today.",

    verse:
      "I can do all this through Him who gives me strength.",

    reference: "Philippians 4:13",

    message:
      "Some days require more strength than we feel we have. Those moments remind us that we do not have to depend entirely on ourselves.\n\nAsk God for what you need to take the next faithful step. You do not need tomorrow's strength today. Ask Him for strength for this moment.",

    prayer:
      "Heavenly Father, give me strength for everything I face today. Help me remember that I can rely on You when I feel weak, tired, or discouraged. Amen.",
  },

  {
    theme: "Hope",

    title: "Hold On to Hope.",

    verse:
      "May the God of hope fill you with joy and peace as you trust in Him.",

    reference: "Romans 15:13",

    message:
      "Hope is especially valuable when circumstances give us little reason to feel hopeful. Christian hope is rooted not only in what we can see, but in the character and faithfulness of God.\n\nWhen the future feels uncertain, turn your attention toward God and remember that difficult seasons do not have the final word.",

    prayer:
      "Heavenly Father, fill my heart with hope today. When I become discouraged, remind me of Your faithfulness and help me trust You with what lies ahead. Amen.",
  },

  {
    theme: "Patience",

    title: "Learning to Wait.",

    verse:
      "Be joyful in hope, patient in affliction, faithful in prayer.",

    reference: "Romans 12:12",

    message:
      "Waiting can be difficult, especially when you desperately want circumstances to change. Yet waiting does not mean doing nothing.\n\nUse seasons of waiting to pray, grow and remain faithful in what God has already placed before you. Patience allows faith to continue even when answers do not arrive immediately.",

    prayer:
      "Heavenly Father, teach me patience when answers take longer than I expect. Help me remain faithful, prayerful and hopeful while I wait. Amen.",
  },

  {
    theme: "Wisdom",

    title: "Seeking God's Wisdom.",

    verse:
      "If any of you lacks wisdom, you should ask God, who gives generously to all.",

    reference: "James 1:5",

    message:
      "Not every decision has an obvious answer. Wisdom helps us look beyond what is easiest and consider what is right, faithful and beneficial.\n\nBefore making an important decision today, slow down. Pray about it, consider biblical principles and give yourself room to listen before acting.",

    prayer:
      "Heavenly Father, give me wisdom for the decisions before me. Help me recognise what is right and guide my thoughts, words and actions today. Amen.",
  },

  {
    theme: "Gratitude",

    title: "A Grateful Heart.",

    verse:
      "Give thanks in all circumstances; for this is God's will for you in Christ Jesus.",

    reference: "1 Thessalonians 5:18",

    message:
      "Gratitude does not require pretending that everything is perfect. We can acknowledge difficulties while still noticing the good gifts God has placed around us.\n\nTake a moment today to identify something you often overlook. Thank God for it and allow gratitude to redirect your attention.",

    prayer:
      "Heavenly Father, thank You for the blessings I sometimes overlook. Give me a grateful heart and help me recognise Your goodness in both ordinary and difficult days. Amen.",
  },

  {
    theme: "Forgiveness",

    title: "Choosing Forgiveness.",

    verse:
      "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.",

    reference: "Ephesians 4:32",

    message:
      "Forgiveness can be difficult when hurt runs deep. Forgiving does not mean pretending that harm never happened. It means refusing to let bitterness control your heart.\n\nBring your hurt honestly before God. Ask Him for the grace to begin releasing resentment and to guide you toward wisdom, healing and peace.",

    prayer:
      "Heavenly Father, help me forgive when forgiveness feels difficult. Heal what has been hurt in me and keep bitterness from taking root in my heart. Amen.",
  },

  {
    theme: "Grace",

    title: "Grace Is Enough.",

    verse:
      "My grace is sufficient for you, for my power is made perfect in weakness.",

    reference: "2 Corinthians 12:9",

    message:
      "We often place pressure on ourselves to appear strong, capable and completely put together. Grace reminds us that weakness does not make us worthless.\n\nBring your limitations honestly to God today. Instead of hiding every weakness, allow those places to remind you how deeply you depend on His grace.",

    prayer:
      "Heavenly Father, thank You for Your grace. When I feel inadequate or weak, remind me that I do not have to rely only on my own strength. Amen.",
  },

  {
    theme: "Perseverance",

    title: "Keep Going.",

        verse:
      "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.",

    reference: "Galatians 6:9",

    message:
      "Doing the right thing can become tiring when progress feels slow or unnoticed. Perseverance means continuing faithfully even when the results are not immediately visible.\n\nDo not measure every faithful step by instant results. Keep doing what is good and trust God with the outcome.",

    prayer:
      "Heavenly Father, help me persevere when I feel tired or discouraged. Give me strength to continue doing what is right and help me trust You with the results. Amen.",
  },

  {
    theme: "Rest",

    title: "Come and Rest.",

    verse:
      "Come to me, all you who are weary and burdened, and I will give you rest.",

    reference: "Matthew 11:28",

    message:
      "Rest is not always about doing nothing. Sometimes genuine rest begins when we stop carrying burdens as though everything depends entirely on us.\n\nBring what is exhausting you to God today. Allow yourself to slow down, breathe and remember that you are not required to carry every burden alone.",

    prayer:
      "Heavenly Father, I bring my tiredness and burdens to You. Help me slow down, rest in Your presence and trust You with the things that are weighing on me. Amen.",
  },

  {
    theme: "Love",

    title: "Walking in Love.",

    verse:
      "And now these three remain: faith, hope and love. But the greatest of these is love.",

    reference: "1 Corinthians 13:13",

    message:
      "Love is more than something we feel. Biblical love is also reflected in patience, kindness, forgiveness and the way we choose to treat others.\n\nLook for one practical opportunity to show love today. It may be through encouragement, patience, listening or simply giving someone your time.",

    prayer:
      "Heavenly Father, teach me to love others with patience, kindness and humility. Help my words and actions reflect the love You have shown me. Amen.",
  },
];

export const dailyContent: DailyContent[] =
  dailyThemes.map(createDailyContent);

export const dailyHomeContent: HomeDailyContent[] =
  dailyContent.map(
    (content) => content.home
  );

export const dailyDevotionals: DailyDevotional[] =
  dailyContent.map(
    (content) => content.devotional
  );