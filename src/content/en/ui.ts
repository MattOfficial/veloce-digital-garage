import { brand } from "./brand";

export const ui = {
  common: {
    actions: {
      back: "Back",
      cancel: "Cancel",
      close: "Close",
      save: "Save",
      saving: "Saving...",
      edit: "Edit",
      delete: "Delete",
      discard: "Discard",
      update: "Update",
      create: "Create",
      preview: "Preview",
      confirm: "Confirm",
      clear: "Clear",
    },
    navigation: {
      currentVehicle: "Current Vehicle:",
      selectVehicle: "Select a vehicle",
      openMenuSrOnly: "Open menu",
    },
    profile: {
      viewProfile: "View Profile",
      logOut: "Log Out",
    },
    emptyValue: "—",
  },
  sidebar: {
    sectionTitle: "Navigation",
    items: {
      dashboard: "Dashboard",
      fuelHistory: "Fuel History",
      maintenance: "Maintenance",
      insights: "Trends",
    },
  },
  auth: {
    signInDescription: "Sign in to manage your vehicles and fuel logs",
    tabs: {
      signIn: "Sign In",
      signUp: "Sign Up",
    },
    fields: {
      email: "Email",
      password: "Password",
      emailPlaceholder: "you@example.com",
      passwordPlaceholder: "••••••••",
    },
    dividers: {
      signIn: "Or continue with",
      signUp: "Or sign up with",
    },
    buttons: {
      signIn: "Sign In",
      signUp: "Sign Up",
      signInWithGoogle: "Sign in with Google",
      signUpWithGoogle: "Sign up with Google",
      continueWithGoogle: "Continue with Google",
    },
    signUpTerms: "By signing up, you agree to our Terms of Service.",
  },
  landing: {
    eyebrow: "The Ultimate Vehicle Management Platform",
    description:
      "Track fuel, log maintenance, and monitor your vehicle statistics with unparalleled elegance.",
    primaryCta: "Get Started",
    secondaryCta: "Sign In",
    footerTagline: "Modern Fuel & Vehicle Tracking.",
    features: [
      {
        title: "Digital Vehicle Garage",
        description:
          "Store all your vehicles in one central cloud garage. Quickly switch between vehicles to view their dedicated statistics.",
      },
      {
        title: "Fuel Logs & Efficiency",
        description:
          "Log every fill-up and track your true MPG. Visualize your fuel efficiency trends over time with dynamic charts.",
      },
      {
        title: "Maintenance Tracker",
        description:
          "Never miss a service. Keep a detailed history of oil changes, tire rotations, and custom maintenance events.",
      },
      {
        title: "Real-time Telemetry",
        description:
          "Experience your vehicle data like never before with our experimental high-performance HUD.",
      },
      {
        title: "Cost Analytics",
        description:
          "Understand your vehicle running costs. Calculate total spend per mile to make informed decisions.",
      },
      {
        title: "Secure & Cloud-Synced",
        description:
          "Built on Supabase for enterprise-grade security. Access your garage securely from any device, anytime.",
      },
    ],
  },
  uploads: {
    avatar: {
      invalidFile: "Please upload an image file.",
      requiresAuth: "You must be logged in to upload an avatar.",
      failed: "Failed to upload avatar.",
      alt: "Profile Picture",
      uploading: "Uploading...",
      changePicture: "Change Picture",
    },
    imagePicker: {
      invalidFile: "Please upload an image file.",
      uploadFailed: (message: string) => `Upload failed. ${message}`,
      notAuthenticated: "Not authenticated",
      modes: {
        upload: "Upload",
        link: "Web URL",
      },
      previewAlt: "Vehicle preview",
      clearImage: "Clear Image",
      clickToUpload: "Click to upload a picture",
      supportedFormats: "PNG, JPG or WEBP (max. 5MB)",
      pasteImageUrl: "Paste image URL",
      imageUrlPlaceholder: "https://example.com/car.jpg",
      preview: "Preview",
    },
    documents: {
      notAuthenticated: "Not authenticated",
      uploadFailed: "Something went wrong uploading the file.",
      vaultLockedTitle: `${brand.ai.vaultName} Locked`,
      vaultLockedDescription:
        "Please add your Gemini API key in Profile Settings to use invoice tracking.",
      uploadingTitle: "Uploading securely...",
      uploadingDescription: "Please wait while we encrypt your document.",
      dropToUpload: "Drop to upload",
      uploadInvoice: "Upload Maintenance Invoice",
      uploadDescription:
        "Drag and drop an image or PDF of your receipt, or click to browse. Max 5MB.",
    },
  },
  copilot: {
    messages: {
      uploadedDocuments: (count: number) => `Uploaded ${count} document(s)`,
      needsMoreInfo: "I need more information.",
      preparedLog: "I've prepared that log for you. Please review and confirm.",
      draftCancelled: "Okay, I cancelled that draft.",
      scopeRefusal: `I can help with ${brand.app.shortName}, your garage data, fuel, maintenance, and vehicle ownership topics only.`,
      missingKey(provider: string) {
        return `I can process basic fuel and maintenance logs locally, but I didn't quite catch that. Please add your ${provider} API key in Profile Settings to unlock conversational AI.`;
      },
      failedResponse: "Failed to get response",
      failedConnection:
        "An error occurred connecting to the AI. Please try again later.",
      fuelSaved: "Fuel log saved to your vehicle!",
      maintenanceSaved: "Maintenance log saved to your vehicle!",
      fileLimit: "You can only attach up to 5 files per message.",
      notLoggedIn: "Not logged in",
      fileUploadFailed: "Failed to upload file",
    },
    header: {
      online: "Online",
      keyMissing: "Key Missing",
      newChatTitle: "New Chat / Clear Context",
      experimentalReady: (provider: string) => `${provider} local AI ready`,
      experimentalNotReady: (provider: string) =>
        `${provider} local AI detected but not ready yet`,
    },
    emptyState: {
      title: "How can I help?",
      example: 'Try saying: "I filled up the Datsun for 1500 rupees today."',
    },
    actions: {
      actionReady: "Action Ready",
      logFuel: "Log Fuel",
      genericAction: "Action",
      confirm: "Confirm",
      dismiss: "Dismiss",
    },
    composer: {
      attachTitle: "Attach receipt or document",
      inputPlaceholder: "Message Copilot...",
    },
    providers: {
      gemini: "Gemini",
      openai: "OpenAI",
      deepseek: "Deepseek",
      deepseekFull: "DeepSeek",
      edgeExperimental: "Edge Local",
      chromeExperimental: "Chrome Nano",
    },
    sources: {
      localNlp: "Local NLP",
      edgeLocal: "Edge Local",
      chromeLocal: "Chrome Nano",
      serverAnalytics: "Server Analytics",
      server: "Server",
      serverGemini: "Server Gemini",
      serverOpenAi: "Server OpenAI",
      serverDeepSeek: "Server DeepSeek",
      guardrailRefusal: "Guardrail Refusal",
    },
    titles: {
      close: "Close",
    },
  },
  telemetry: {
    exit: "Exit Telemetry",
    title: "VELOCE TELEMETRY",
    liveLink: "LIVE SYSTEM LINK",
    labels: {
      currentSpeed: "Current Speed",
      speedUnit: "km/h",
      engineRpm: "Engine RPM",
      rpmUnit: "RPM",
      gear: "Gear",
      gForceVector: "Dynamic G-Force Vector",
      accelG: "+1G ACCEL",
      brakeG: "-1G BRAKE",
      leftG: "+1G LEFT",
      rightG: "-1G RIGHT",
      coreTemp: "Core Temp",
      tempUnit: "°C",
      oilPressure: "Oil Pressure",
      oilPressureUnit: "BAR",
      diagnostics: "Diagnostics",
    },
    initialLogs: [
      "> INITIATING HANDSHAKE... OK",
      "> ECU CALIBRATION... DONE",
      "> AERO SENSORS... ACTIVE",
      "> TRACTION CTRL... T1",
    ],
    rotatingMessages: [
      "ADJUSTING BRAKE BIAS: R40 / F60",
      "AERO PROFILES: SPORT MODE",
      "BATTERY REGEN: ACTIVE",
      "TYRE TEMP: OPTIMAL",
      "DOWNFORCE: +120kg",
      "SUSPENSION: STIFF",
    ],
  },
  activityHeatmap: {
    activeDays: (count: number) =>
      `${count} active ${count === 1 ? "day" : "days"}`,
    activities: (count: number) =>
      `${count} ${count === 1 ? "activity" : "activities"}`,
    fuelStops: (count: number) =>
      `${count} fuel ${count === 1 ? "stop" : "stops"}`,
    maintenancePayments: (count: number) =>
      `${count} maintenance ${count === 1 ? "payment" : "payments"}`,
    loading: "Loading activity…",
    emptyTitle: "No activity yet",
    emptyDescription:
      "Fuel stops and maintenance payments will appear here.",
    fuelLegend: "Fuel",
    maintenanceLegend: "Maintenance",
    intensityLegend: "More activity = stronger color",
  },
  dashboard: {
    loading: "Loading dashboard...",
    noVehiclesFoundTitle: "No Vehicles Found",
    noVehiclesFoundDescription:
      "Please add a vehicle to your garage to view the dashboard and analytics.",
    goToProfile: "Go to Profile",
    overviewTitle: "Overview",
    overviewDescription: (vehicleLabel: string) =>
      `Tracking analytics and insights for your ${vehicleLabel}.`,
    viewFullVehicleProfile: "View Full Vehicle Profile",
    currentOdometer: "Current Odometer",
    odometerSuffix: (unit: string) => `${unit} on the clock`,
    thirtyDaySpend: "30-Day Spend",
    previousThirtyDaysComparison: (trend: number) =>
      `${trend > 0 ? "↑" : trend < 0 ? "↓" : ""} ${Math.abs(trend).toFixed(1)}% vs previous 30 days`,
    distanceLastThirtyDays: "Distance Last 30 Days",
    distanceLastThirtyDaysDescription: "Driven over the last 30 days",
    distanceNeedsOdometerLogs: "Need odometer logs to calculate this",
    basedOnAvailableOdometerLogs:
      "Based on the odometer logs currently available",
    lifetimeMaintenance: "Lifetime Maintenance",
    allTimeRepairCost: "All time repair cost",
    expenseHistoryTitle: "6-Month Expense History",
    expenseHistoryDescription: "Track your spending trends over half a year.",
    expenseDistributionTitle: "Expense Distribution",
    expenseDistributionDescription: "Lifetime spending breakdown by category.",
    totalLabel: "Total",
    noExpensesLoggedYet: "No expenses logged yet.",
    recentActivityTitle: "Recent Activity",
    recentActivityDescription: "The last 5 events recorded for your vehicle.",
    fuelActivityLabel: "Refueled",
    customEntryLabel: "Custom Entry",
    maintenanceLogged: "Maintenance logged",
    entryLogged: "Entry logged",
    noRecentActivity:
      "No recent activity found. Log your first fill-up or service!",
    quickActionsTitle: "Quick Actions",
    quickActionsDescription:
      "Add new records to your vehicle without leaving the dashboard.",
    activityTitle: "Activity Rhythm",
    activityDescription:
      "Fuel stops and maintenance payments for this vehicle over the last 12 months.",
    logFillUp: "Log a Fill-up",
    addMaintenanceRecord: "Add Maintenance Record",
    expenseCategories: {
      fuel: "Fuel",
      maintenance: "Maintenance",
      other: "Other",
    },
  },
  fuel: {
    chargeMetricUnits: {
      km: "km/kWh",
      miles: "mi/kWh",
    },
    pageTitle: "Fuel Analysis",
    pageDescription: (vehicleLabel: string) =>
      `Metrics & history for your ${vehicleLabel}.`,
    noVehicleSelectedTitle: "No Vehicle Selected",
    noVehicleSelectedDescription:
      "Select a vehicle from the top nav to analyze fuel data.",
    noFuelDataYetTitle: "No fuel data yet",
    noFuelDataYetDescription:
      "Log your first fill-up to unlock efficiency metrics, cost charts, and historical analysis.",
    analyticsHelper:
      "Partial top-ups are saved immediately and applied to efficiency analytics once the next full top-up is recorded.",
    analysisModeTitle: "Analysis Mode",
    analysisMode: {
      fuel: "Fuel Analysis",
      charge: "Charge Analysis",
    },
    averageEfficiency: "Average Efficiency",
    changeEfficiencyUnit: (unit: string) =>
      `Change efficiency unit. Currently ${unit}.`,
    costPerDistance: (unit: string) => `Cost per ${unit.toUpperCase()}`,
    averageRunningCost: "Average running cost",
    latestUnitPrice: (mode: "fuel" | "charge") =>
      mode === "charge" ? "Latest Energy Rate" : "Latest Fuel Price",
    perUnit: (unit: string) => `per ${unit}`,
    unitPriceUnavailable: "Add a priced session to track rate changes",
    noPreviousUnitPrice: "First priced session",
    unitPriceUpFromFreeSession: "Up from a free previous session",
    unitPriceComparison: (changePercent: number) =>
      `${changePercent > 0 ? "+" : ""}${changePercent.toFixed(1)}% vs previous session`,
    efficiencyTrendTitle: "Efficiency Trend",
    efficiencyTrendDescription: (mode: "fuel" | "charge") =>
      mode === "charge"
        ? "Charging efficiency over your closed charge sessions."
        : "Fuel efficiency over your closed top-up segments.",
    unitPriceTrendTitle: (mode: "fuel" | "charge") =>
      mode === "charge" ? "Energy Rate Trend" : "Fuel Price Trend",
    unitPriceTrendDescription: (mode: "fuel" | "charge") =>
      mode === "charge"
        ? "See how your cost per kWh changes between sessions."
        : "See how your price per unit changes between visits.",
    batteryRangeTrendTitle: "Battery Range Trend",
    batteryRangeTrendDescription:
      "Track your EV's estimated battery range over time.",
    fillUpHistoryTitle: "Fill-Up History",
    fillUpHistoryDescription:
      "Detailed log of all recorded fuel and charge transactions.",
    columns: {
      date: "Date",
      energyType: "Energy Type",
      fillType: "Fill Type",
      odometer: "Odometer",
      volume: "Volume / Energy",
      cost: "Cost",
      efficiency: "Efficiency",
      actions: "Actions",
    },
    fillTypes: {
      full: "Full",
      partial: "Partial",
      pending: "Pending full top-up",
    },
    efficiencyStates: {
      pending: "Pending full top-up",
      unavailable: "Not enough data",
    },
    energyTypes: {
      fuel: "Fuel",
      charge: "Charge",
    },
    modal: {
      trigger: "Log Fill-Up",
      title: {
        fillUp: "Log Fill-Up",
        charge: "Log Charge",
        hybrid: "Log Fill-Up / Charge",
      },
      description: (vehicleLabel: string) =>
        `Enter details for your ${vehicleLabel}.`,
      tabs: {
        fuel: "Fuel",
        charge: "Charge",
      },
      labels: {
        date: "Date",
        odometer: (unit: string) => `Odometer (${unit})`,
        energy: "Energy (kWh)",
        volume: (unit: string) => `Volume (${unit})`,
        cost: (currency: string) => `Cost (${currency})`,
        fillType: "Top-Up Type",
        estimatedRange: (unit: string) => `Estimated Range (${unit})`,
        estimatedRangeOptional: "(Optional)",
        partialFillHelper:
          "Partial top-ups are saved now and will be folded into analytics after the next full top-up.",
      },
      fillTypeOptions: {
        fullFuel: "Full fill",
        partialFuel: "Partial fill",
        fullCharge: "Full charge",
        partialCharge: "Partial charge",
      },
      placeholders: {
        odometer: "e.g. 46250",
        energy: "e.g. 50.5",
        volume: "e.g. 35.5",
        cost: "e.g. 50.00",
        range: "e.g. 300",
      },
      messages: {
        saved: "Fuel log successfully added!",
        failed: "Failed to add log.",
        unexpected: "An unexpected error occurred.",
      },
      submit: {
        save: "Save Log",
        saving: "Saving...",
      },
      editTitle: "Edit Fill-Up Entry",
      editDescription:
        "Update the details for this fill-up. Efficiency will be recalculated automatically.",
      editSaved: "Fill-up updated successfully!",
      editFailed: "Failed to update log.",
      saveChanges: "Save Changes",
      estimatedRangeShort: (unit: string) => `Est. Range (${unit})`,
    },
    deleteDialog: {
      title: "Delete Fill-Up Entry",
      description: (logDate: string) =>
        `You are about to permanently delete the fill-up entry from ${logDate}. This action cannot be undone.`,
      warningTitle: "Permanent deletion warning",
      warningBody:
        "Deleting this entry will also affect the efficiency calculations for subsequent fill-ups.",
      confirmInstruction: "To confirm, type",
      confirmPhrase: "delete this entry",
      confirmSuffix: "below:",
      deleted: "Fill-up entry permanently deleted.",
      failed: "Failed to delete entry.",
      unexpected: "An unexpected error occurred.",
      deletePermanently: "Delete Permanently",
      deleting: "Deleting...",
    },
  },
  insights: {
    noVehicleSelectedTitle: "No Vehicle Selected",
    noVehicleSelectedDescription: "Select a vehicle to view trends.",
    insufficientDataTitle: "Insufficient Data",
    insufficientDataDescription: (mode: "fuel" | "charge") =>
      mode === "charge"
        ? "Log charges on at least two different days to establish a cadence baseline."
        : "Log fuel top-ups on at least two different days to establish a cadence baseline.",
    pageTitle: "Trends",
    pageDescription: (vehicleLabel: string) =>
      `Long-range cost, distance, and cadence trends for your ${vehicleLabel}.`,
    pageDescriptionShort: (vehicleLabel: string) =>
      `Explore how your ${vehicleLabel} costs and drives over time.`,
    tabs: {
      runningCosts: "Costs",
      distance: "Distance",
    },
    trackedSpend: "Tracked Spend",
    trackedSpendDescription:
      "Fuel, maintenance, and custom costs recorded for this vehicle",
    averageMonthlySpend: "Monthly Cost Baseline",
    averageMonthlySpendDescription: (months: number) =>
      months > 0
        ? `Average across ${months} tracked calendar ${months === 1 ? "month" : "months"}`
        : "Add a cost record to establish a monthly baseline",
    recentMonthlyBaselineDescription: (months: number) =>
      `Average across the latest ${months} tracked ${months === 1 ? "month" : "months"}`,
    costLastThirtyDays: "Last 30 Days",
    noPreviousPeriod: "No comparable spend in the previous 30 days",
    periodTrend: (percent: number, direction: "higher" | "lower") =>
      `${percent}% ${direction} than the previous 30 days`,
    energyCostPerDistance: (mode: "fuel" | "charge", unit: string) =>
      `${mode === "charge" ? "Charging" : "Fuel"} Cost / ${unit}`,
    energyCostPerDistanceDescription: (
      mode: "fuel" | "charge",
      segments: number,
    ) =>
      segments > 0
        ? `Weighted from ${segments} closed ${mode === "charge" ? "charging" : "refueling"} ${segments === 1 ? "interval" : "intervals"}`
        : `Complete a full ${mode === "charge" ? "charging" : "refueling"} interval to unlock this metric`,
    costTrendDescription:
      "Twelve contiguous months of tracked spend, with the total trend overlaid",
    trailingTwelveMonths: "Trailing 12 months",
    noCostDataTitle: "No recorded costs yet",
    noCostDataDescription:
      "Fuel, charging, maintenance, and tracker costs will build this trend as you log them.",
    costMix: {
      title: "Cost Mix",
      fuel: "Fuel & charging",
      maintenance: "Maintenance",
      other: "Other",
      total: "Total trend",
      description: (category: string, share: number) =>
        `${category} is the largest recorded cost at ${share}% of spend.`,
      empty: "Your recorded cost composition will appear here.",
    },
    everyDays: (days: number) => `Every ${days} days`,
    peakCostMonth: "Peak Cost Month",
    peakCostMonthDescription: (month: string, driver: string) =>
      `${month} was the highest-spend month, led by ${driver.toLowerCase()}.`,
    energyCostTrendTitle: (mode: "fuel" | "charge") =>
      `${mode === "charge" ? "Charging" : "Fuel"} Cost Intensity`,
    energyCostTrendDescription: (unit: string) =>
      `Cost per ${unit} across the latest closed intervals`,
    energyCostTrendSeries: "Cost per distance",
    energyCostTrendEmpty: (mode: "fuel" | "charge") =>
      `Complete at least two full ${mode === "charge" ? "charging" : "refueling"} intervals to reveal the trend.`,
    costMethodNote: (month: string) =>
      `Current period values are calculated through ${month}; future-dated records are excluded from rolling comparisons.`,
    averageDailyDistance: "Avg. Daily Distance",
    averageDailyDistanceDescription: "Typical distance covered per day",
    analysisModeTitle: "Energy Lens",
    analysisModeDescription:
      "Switch cadence and energy-cost signals between fuel and charging records.",
    analysisMode: {
      fuel: "Fuel",
      charge: "Charging",
    },
    expenseBreakdownTitle: "Expense Breakdown",
    expenseBreakdownDescription:
      "Recorded monthly spend split by fuel, maintenance, and custom costs",
    cadencePredictionsTitle: "Cadence Predictions",
    cadencePredictionsDescription: (
      mode: "fuel" | "charge",
      intervals: number,
      confidence: string,
    ) => {
      if (intervals === 0) {
        return mode === "charge"
          ? "Add another charging day to establish a cadence"
          : "Add another refueling day to establish a cadence";
      }

      const activity = mode === "charge" ? "charging" : "refueling";
      return `Median of ${intervals} recent ${activity} ${intervals === 1 ? "interval" : "intervals"} · ${confidence} confidence`;
    },
    distanceSectionTitle: "Distance Driven",
    distanceSectionDescription:
      "Recent distance rollups and monthly driving history from odometer logs",
    distanceLastThirtyDays: "Distance Last 30 Days",
    distanceLastTwelveMonths: "Distance Last 12 Months",
    monthlyDistanceHistoryTitle: "Monthly Distance History",
    monthlyDistanceHistoryDescription:
      "Trailing 12-month view of distance covered",
    distanceInsufficientDataTitle: "Not Enough Distance Data",
    distanceInsufficientDataDescription:
      "Add odometer-bearing fuel or charge logs to unlock distance history.",
    basedOnAvailableOdometerLogs:
      "Based on the odometer logs currently available",
    distanceTrends: {
      currentMonth: "This Month",
      estimatedThrough: (date: string) => `Estimated through ${date}`,
      noCurrentCoverage: "No supported odometer interval this month",
      typicalMonth: "Typical Month",
      medianAcross: (months: number) =>
        months > 0
          ? `Median across ${months} covered, completed ${months === 1 ? "month" : "months"}`
          : "Complete another odometer interval to establish a baseline",
      trailingTotal: (months: number) => `${months}-Month Est. Distance`,
      basedOnCoveredMonths: (months: number) =>
        months > 0
          ? `Supported across ${months} ${months === 1 ? "month" : "months"} with coverage`
          : "No supported months in this range",
      busiestMonth: "Busiest Covered Month",
      busiestMonthDescription: (month: string) =>
        `${month} has the highest estimated distance in view`,
      notEnoughEvidence: "Not enough dated odometer evidence",
      chartTitle: "Monthly Distance Rhythm",
      chartDescription:
        "A null-aware monthly line with a three-month pace overlay. Select any month to inspect its estimated daily shape.",
      estimatedBadge: "Odometer estimate",
      estimatedDistance: "Estimated distance",
      estimatedDailyDistance: "Estimated daily distance",
      rollingAverage: "3-month pace",
      rangeLabel: "Distance history range",
      monthPickerLabel: "Choose a month to inspect",
      clickHint: "Select a point or month to open its daily distance estimate.",
      noChartDescription:
        "Add at least two dated odometer readings through fuel, charging, or maintenance logs. Unknown months stay blank instead of being shown as zero.",
      paceTitle: "Selected Month Pace",
      comparisonUnavailable:
        "A comparable previous period is not available for this month.",
      comparison: (
        percent: number,
        direction: "up" | "down" | "steady" | "unavailable",
        basis: "full-month" | "month-to-date",
      ) => {
        const window = basis === "month-to-date" ? "same point last month" : "previous month";
        if (direction === "steady") return `Level with the ${window}.`;
        return `${percent}% ${direction === "up" ? "above" : "below"} the ${window}.`;
      },
      openDailyView: "Open daily estimate",
      coverageTitle: "Range Coverage",
      coverageDescription: (coveredDays: number, totalDays: number) =>
        `${coveredDays} of ${totalDays} calendar days sit between usable odometer readings.`,
      evidenceTitle: "Odometer Evidence",
      evidenceDescription: (fuelReadings: number, maintenanceReadings: number) =>
        `${fuelReadings} fuel or charging records and ${maintenanceReadings} maintenance readings were evaluated.`,
      decreasingReadings: (count: number) =>
        `${count} decreasing odometer ${count === 1 ? "reading was" : "readings were"} excluded.`,
      detailTitle: (month: string) => `${month} Distance Detail`,
      detailDescription:
        "Daily values are estimates distributed between dated odometer readings—not reconstructed trips. Missing evidence remains a visible gap.",
      previousMonth: "Previous",
      nextMonth: "Next",
      totalDistance: "Estimated Total",
      previousPeriod: "Previous Period",
      dailyAverage: "Covered-Day Average",
      evidenceCoverage: "Evidence Coverage",
      dailyTitle: "Day-by-Day Estimate",
      dailyDescription:
        "The line allocates each odometer change evenly across the calendar days between its two readings.",
      noDailyTitle: "No daily estimate available",
      noDailyDescription:
        "This month is not bracketed by enough dated odometer evidence to infer a daily shape.",
      peakEstimatedDay: "Highest Estimated Day",
      readingDays: "Readings Inside Month",
      interpolationSpan: "Largest Estimate Span",
      days: (days: number) => `${days} ${days === 1 ? "day" : "days"}`,
      methodTitle: "How this estimate works",
      methodDescription:
        "Fuel, charging, and odometer-bearing maintenance records are merged by date. Same-day readings use the highest odometer, future or invalid readings are ignored, and odometer decreases are excluded from the trend.",
      coverage: {
        full: "Full interval coverage",
        partial: (percent: number) => `${percent}% interval coverage`,
        none: "No interval coverage",
      },
    },
    refillFrequency: (mode: "fuel" | "charge") =>
      mode === "charge" ? "Charging Frequency" : "Refueling Frequency",
    estimatedNextRefill: (mode: "fuel" | "charge") =>
      mode === "charge" ? "Estimated Next Charge" : "Estimated Next Refuel",
    frequencySummary: (mode: "fuel" | "charge", days: number, weeks: number) =>
      mode === "charge"
        ? `You typically plug in roughly every ${days} days, or about every ${weeks} weeks.`
        : `You typically visit a fuel station roughly every ${days} days, or about every ${weeks} weeks.`,
    nextRefillSummary: (mode: "fuel" | "charge") =>
      mode === "charge"
        ? "Based on your current charging cadence, you will likely need another top-up around this date."
        : "Based on your current driving cadence, you will likely need to refuel around this date.",
    unknownDate: "Unknown",
  },
  maintenance: {
    pageTitle: "Maintenance",
    pageDescription: (vehicleLabel: string) =>
      `Predictive vitals and expense tracking for your ${vehicleLabel}.`,
    noVehicleSelectedTitle: "No Vehicle Selected",
    noVehicleSelectedDescription:
      "Select a vehicle to view maintenance schedules.",
    tabs: {
      overview: "Overview",
      invoices: "Service",
      trackers: "Trackers",
    },
    lifetimeMaintenanceCost: "Lifetime Maintenance Cost",
    lifetimeMaintenanceCostDescription: "Total spent on keeping it running",
    thirtyDayMaintenanceSpend: "Maintenance Spend Last 30 Days",
    thirtyDayMaintenanceSpendDescription: "Recent maintenance expenditure",
    currentOdometer: "Current Odometer",
    currentOdometerDescription:
      "Used to calculate service intervals and due reminders",
    maintenanceCostPerDistance: (unit: string) =>
      `Maintenance Cost per ${unit.toUpperCase()}`,
    maintenanceCostPerDistanceDescription: "Depreciation via service",
    servicesLogged: "Services Logged",
    totalServiceRecords: "Total service records",
    healthMonitorTitle: "Health Monitor",
    healthMonitorDescription: (odometer: string, unit: string) =>
      `Estimated lifespan of critical components based on your odometer (${odometer}${unit}).`,
    healthHealthy: "Healthy",
    noMaintenanceLoggedTitle: "No maintenance logged",
    noMaintenanceLoggedDescription:
      "Log your first service to unlock spending breakdowns and historical analytics.",
    spendByCategory: "Spend by Category",
    maintenanceTimeline: "Maintenance Timeline",
    maintenanceTimelineDescription:
      "Visualize the frequency and cost of shop visits.",
    serviceLogTitle: "Service Log",
    serviceLogDescription:
      "Detailed history of all documented repairs and maintenance.",
    noServiceRecordsTitle: "No service records found",
    noServiceRecordsDescription:
      "When you log your first service, it will appear here.",
    columns: {
      date: "Date",
      servicePerformed: "Service Performed",
      additionalNotes: "Additional Notes",
      invoiceCost: "Invoice Cost",
      actions: "Actions",
    },
    trackersTitle: "Custom Trackers",
    trackersDescription:
      "Keep track of other vital health data like washer fluid, coolants, or accessories.",
    addMaintenance: {
      trigger: "Log Maintenance",
      title: {
        create: "Log Service Record",
        edit: "Edit Service Record",
      },
      description: {
        create:
          "This record will be permanently attached to this vehicle's history.",
        edit: "Update the details of this maintenance record.",
      },
      labels: {
        serviceDate: "Service Date",
        servicePerformed: "Service Performed",
        odometerAtService: (unit: string) => `Odometer at Service (${unit})`,
        totalCost: (currency: string) => `Total Cost (${currency})`,
        notes: "Notes & Provider (Optional)",
      },
      pickDate: "Pick a date",
      serviceTypes: [
        "Scheduled Service",
        "Engine Oil Change",
        "Tire Rotation / Replacement",
        "Brake Pad Replacement",
        "Air Filter Replacement",
        "Battery Replacement",
        "Transmission Fluid",
        "General Inspection",
        "Other Repair",
      ],
      servicePlaceholder: "Select maintenance type",
      odometerPlaceholder: "e.g. 46250",
      costPlaceholder: "0.00",
      notesPlaceholder: "e.g. Jiffy Lube, included multi-point inspection.",
      saved: "Service record saved!",
      updated: "Service record updated!",
      saveRecord: "Save Record",
    },
    maintenanceActions: {
      confirmDelete: "Are you sure you want to delete this maintenance record?",
      editRecord: "Edit Record",
      deleteRecord: "Delete Record",
      deleting: "Deleting...",
    },
    reminders: {
      trigger: "New Reminder",
      title: "Setup Service Reminder",
      description:
        "Track a component lifespan. We will alert you when service is due based on time or mileage.",
      serviceComponentName: "Service / Component Name",
      serviceComponentPlaceholder: "e.g. Engine Oil, Spark Plugs, Air Filter",
      intervalMonths: "Interval (Months)",
      intervalDistance: (unit: string) => `Interval (${unit})`,
      monthsPlaceholder: "e.g. 6",
      distancePlaceholder: "e.g. 10000",
      baselineTitle: "Initial Baseline state (Optional)",
      lastServiceDate: "Last Service Date",
      lastServiceOdo: "Last Service ODO",
      lastServiceOdoPlaceholder: "e.g. 45000",
      startTracking: "Start Tracking",
      failed: "Failed to create reminder",
      titleList: "Next Service",
      descriptionList:
        "Uses the manufacturer interval saved in Vehicle Details.",
      emptyTitle: "Service interval not set",
      emptyDescription:
        "Set the manufacturer service interval in Vehicle Details to start due notifications.",
      statusHealthy: "On track",
      statusDueSoon: "Due soon",
      statusOverdue: "Overdue",
      statusNeedsBaseline: "Needs baseline",
      dueNow: "Service due now",
      baselineMissing: "Log a scheduled service to begin countdown tracking.",
      lastCompleted: "Last completed",
      everyMonths: (months: number) =>
        `Every ${months} month${months === 1 ? "" : "s"}`,
      everyDistance: (distance: string, unit: string) =>
        `Every ${distance} ${unit}`,
      delete: "Delete reminder",
    },
    ocr: {
      title: "AI Receipt Analysis",
      description:
        "Review the extracted data before saving it to your vehicle's history.",
      processingTitle: "Reading Document...",
      processingDescription: "Extracting line items, dates, and costs.",
      cancel: "Cancel",
      provider: "Service Provider",
      date: "Date",
      totalCost: "Total Cost",
      extractedLineItems: "Extracted Line Items",
      foundSuffix: "Found",
      noLineItems: "No detailed line items detected.",
      verifyAndSave: "Verify & Save",
      failedAnalyze: "Failed to analyze document.",
      failedSave: "Failed to save records.",
      notAuthenticated: "Not authenticated",
      autoExtractedFromReceipt: "Auto-extracted from receipt.",
      lineItemsTitle: "Line Items:",
      serviceAt: (provider: string) => `Service at ${provider}`,
      generalMaintenance: "General Maintenance",
      defaultDocumentName: "Invoice.pdf",
    },
  },
  trackers: {
    createTrackerTrigger: "Create Custom Tracker",
    createTrackerTitle: "New Custom Tracker",
    createTrackerDescription:
      "Build a custom widget to track events on your vehicles.",
    iconLabels: {
      Sparkles: "Sparkles",
      Droplets: "Droplets",
      PaintBucket: "PaintBucket",
      Receipt: "Receipt",
      Wrench: "Wrench",
      Map: "Map",
      Zap: "Zap",
      Battery: "Battery",
      Car: "Car",
      Umbrella: "Umbrella",
    },
    colorLabels: {
      blue: "Blue",
      emerald: "Emerald",
      violet: "Violet",
      rose: "Rose",
      amber: "Amber",
      slate: "Slate",
    },
    trackerName: "Tracker Name",
    trackerNamePlaceholder: "e.g. Car Washes, Detailing, Tolls",
    selectIcon: "Select Icon",
    colorTheme: "Color Theme",
    trackCost: "Track Cost",
    trackCostDescription: "Log monetary expenses along with this event?",
    creatingTracker: "Creating Tracker...",
    buildTracker: "Build Tracker",
    widgetDescription: (name: string) =>
      `Track timeline events for ${name.toLowerCase()}.`,
    logEvent: "Log Event",
    logNew: (name: string) => `Log New: ${name}`,
    logNewDescription: "Add a new entry to this tracker's timeline.",
    logDate: "Date",
    totalCost: (currency: string) => `Total Cost (${currency})`,
    notesDetails: "Notes & Details (Optional)",
    notesPlaceholder: "Any specific details about this event...",
    saveLog: "Save Log",
    deleteTracker: "Delete Tracker",
    deleteTrackerConfirm: (name: string) =>
      `Are you sure you want to permanently delete the "${name}" tracker and all its historical logs? This cannot be undone.`,
    noEntriesYet: "No entries yet",
    noEntriesDescription:
      "You have not created any custom trackers yet. Add one to start monitoring specific parts or services for your vehicle.",
    startTrackingDescription: (name: string) =>
      `Start tracking events for your ${name.toLowerCase()} here.`,
    noAdditionalDetails: "No additional details recorded.",
    tyre: {
      title: "Tyres & Traction",
      description: "Monitor asymmetric configurations and tread life.",
      updateTires: "Update Tires",
      updateTiresDescription:
        "Register new tires or update tread depth for your wheels.",
      noTireInfo:
        "No tire information recorded. Add your tires to track their lifespan and receive alerts.",
      addTires: "Add Tires",
      addTiresDescription:
        "Enter the details of the tires currently on the vehicle.",
      close: "Close",
      noTireForPosition: "No tire logged for this position.",
      interactiveMapTitle: "Interactive Tire Map",
      interactiveMapDescription:
        "Tap on any wheel on the diagram to see its specific details, age, and tread depth.",
      wheelTitle: (position: string) => `${position} Tire`,
      brandAndModel: "Brand & Model",
      ageDot: "Age / DOT",
      distanceDriven: "Distance Driven",
      treadDepth: "Tread Depth",
      status: "Status",
      notRecorded: "Not recorded",
      applyTo: "Apply To",
      selectWheels: "Select wheels",
      bothWheels: "Both Wheels",
      frontOnly: "Front Only",
      rearOnly: "Rear Only",
      allFourWheels: "All 4 Wheels",
      frontPairOnly: "Front Pair Only",
      rearPairOnly: "Rear Pair Only",
      frontLeftOnly: "Front Left Only",
      frontRightOnly: "Front Right Only",
      rearLeftOnly: "Rear Left Only",
      rearRightOnly: "Rear Right Only",
      brandModelLabel: "Brand & Model",
      brandModelPlaceholder: "e.g. Michelin Pilot Sport 4S",
      dotOptional: "DOT (Optional)",
      dotPlaceholder: "e.g. 4725",
      treadMm: "Tread (mm)",
      treadPlaceholder: "e.g. 7.5",
      installationDate: "Installation Date",
      pickDate: "Pick a date",
      odometerAtInstall: "Odometer at Install",
      saveTireData: "Save Tire Data",
      positions: {
        FL: "Front Left",
        FR: "Front Right",
        RL: "Rear Left",
        RR: "Rear Right",
        F: "Front Wheel",
        R: "Rear Wheel",
      },
      health: {
        noData: "No data",
        healthy: "Healthy",
        inspectSoon: "Inspect Soon",
        wornOut: "Worn Out",
        lowTread: "Low Tread",
        wornTread: "Worn Tread",
      },
    },
  },
  vehicle: {
    back: "Back",
    heroAlt: "Vehicle Hero",
    vitalsTitle: "Vehicle Vitals",
    added: "Added",
    odometer: "Odometer",
    currentOdometer: "Current Odometer",
    currentOdometerDescription:
      "Update this when you want reminders to reflect your latest reading immediately.",
    currentOdometerPlaceholder: "e.g. 46250",
    currentOdometerUpdated: "Current odometer updated.",
    serviceIntervalTitle: "Service Interval",
    serviceIntervalDescription:
      "Save the manufacturer interval, such as 12 months or 10,000 km, whichever comes first.",
    serviceIntervalMonths: "Time Interval (Months)",
    serviceIntervalDistance: (unit: string) => `Distance Interval (${unit})`,
    serviceIntervalSave: "Save Service Interval",
    serviceIntervalSaved: "Service interval updated.",
    serviceIntervalEmpty: "No service interval configured yet.",
    serviceIntervalLastService: "Last scheduled service",
    serviceIntervalNeedsServiceLog:
      "The next due date will start after you log a scheduled service.",
    fuelTotal: "Fuel Total",
    maintenanceTotal: "Maint. Total",
    specsTitle: "Specifications & Details",
    specsDescription:
      "Manage your vehicle's identifying information and attributes.",
    cancel: "Cancel",
    nickname: "Vehicle Nickname",
    nicknamePlaceholder: "e.g. Froggy2, The Beast",
    vin: "VIN (Vehicle Identification Number)",
    vinPlaceholder: "17-character VIN",
    licensePlate: "License Plate",
    licensePlatePlaceholder: "e.g. ABC-1234",
    exteriorColor: "Exterior Color",
    exteriorColorPlaceholder: "e.g. Midnight Blue",
    engineType: "Engine Type",
    engineTypePlaceholder: "e.g. 2.0L Inline-4 Turbo",
    transmission: "Transmission",
    transmissionPlaceholder: "e.g. 8-Speed Automatic",
    modelYear: "Model Year",
    importantNotes: "Important Notes",
    notesPlaceholder:
      "Insurance policy numbers, radio codes, tire pressure specs, or any other reminders...",
    customSpecifications: "Custom Specifications",
    addField: "Add Field",
    customFieldKeyPlaceholder: "e.g. Tire Brand",
    customFieldValuePlaceholder: "e.g. Michelin",
    noCustomSpecifications:
      "No custom specifications added. Click the button above to add one.",
    saveSpecifications: "Save Specifications",
    savingSpecifications: "Saving Specs...",
    updatedSpecifications: "Vehicle specifications updated successfully.",
    deleteTrackerTitle: "Delete Tracker",
    serviceHistoryTitle: "Service History",
    serviceHistoryDescription:
      "A complete log of maintenance performed on this vehicle.",
    serviceHistoryEmptyTitle: "No Service History",
    serviceHistoryEmptyDescription:
      "This vehicle does not have any maintenance records yet. Keep track of oil changes, tire rotations, and repairs to monitor its health.",
    columns: {
      date: "Date",
      serviceType: "Service Type",
      odometer: "Odometer",
      notes: "Notes",
      cost: "Cost",
    },
    emptyValue: "—",
  },
  profile: {
    headerTitle: "Your Profile",
    rewardsDescription: `Manage your personal information and view your ${brand.rewards.name}.`,
    achievementsTitle: "Trophy Cabinet",
    achievementsDescription: `Your unlocked ${brand.app.shortName} achievements. Keep logging data to unlock more!`,
    distanceAnalyticsTitle: "Garage Distance Snapshot",
    distanceAnalyticsDescription:
      "Recent and lifetime distance totals across every vehicle in your garage.",
    distanceLastThirtyDays: "Distance Last 30 Days",
    distanceLastTwelveMonths: "Distance Last 12 Months",
    lifetimeDistance: "Lifetime Distance",
    distanceUnavailable: "Unavailable",
    distanceUnavailableDescription:
      "Add odometer-bearing fuel or charge logs to unlock this metric.",
    distanceFullCoverageDescription: "Across every vehicle in your garage.",
    distancePartialCoverage: (
      contributingVehicles: number,
      totalVehicles: number,
    ) =>
      `Based on available odometer logs from ${contributingVehicles} of ${totalVehicles} vehicles.`,
    activityTitle: "Garage Activity",
    activityDescription:
      "A combined view of fuel stops and maintenance payments across every vehicle over the last 12 months.",
    detailsTitle: "Profile Details",
    detailsDescription: "Update your public facing information here.",
    appearanceTitle: "Appearance",
    appearanceDescription: "Customize how Veloce looks on your device.",
    appearanceThemeLabel: "Theme",
    appearanceThemeDescription: "Toggle between light and dark modes.",
    avatarLabel: "Display Picture",
    displayName: "Display Name",
    displayNamePlaceholder: "Awesome Driver",
    displayNameDescription:
      "This is the name that will be displayed in the application sidebar.",
    preferredCurrency: "Preferred Currency",
    currencyPlaceholder: "Select a currency",
    currencyDescription:
      "This currency symbol will be used across all your tracking and insights.",
    distanceUnit: "Distance Unit",
    distanceUnitPlaceholder: "Select distance unit",
    distanceUnitDescription:
      "Will affect speed, volumes (Liters vs Gallons) and economy rates.",
    distanceOptions: {
      kilometers: "Kilometers (km)",
      miles: "Miles",
    },
    saveSuccess: "Profile updated successfully!",
    avatarUploaded: "Image uploaded! Don't forget to save.",
    clearStorageConfirm:
      "This will clear your local and session storage (session persistence). You might need to refresh. Continue?",
    clearStorageSuccess: "Storage cleared successfully.",
    keyDeleteSuccess: "API key deleted successfully.",
    deleteKeyConfirm(providerName: string) {
      return `Are you sure you want to delete your ${providerName} API key?`;
    },
    copilotSettings: `${brand.ai.copilotName} Settings`,
    preferredProvider: "Preferred AI Provider",
    providerPlaceholder: "Select provider",
    providerOptions: {
      gemini: "Google Gemini",
      openai: "OpenAI",
      deepseek: "Deepseek (OpenAI Compatible)",
    },
    secureKeyStored: "Key is stored securely",
    deleteKey: "Delete Key",
    geminiKey: "Google Gemini API Key",
    openaiKey: "OpenAI API Key",
    deepseekKey: "Deepseek API Key",
    maskedKey: "••••••••••••••••••••••••••••",
    geminiKeyPlaceholder: "AIzaSy...",
    openaiLikeKeyPlaceholder: "sk-...",
    bringYourOwnKeys:
      "Bring your own keys to enable AI features. They will be encrypted with AES-256 before storage.",
    copilotProviderDescription: `${brand.ai.copilotName} will use your Preferred Provider if the key is available.`,
    saveProfile: "Save Profile",
    clearBrowserStorage: "Clear Browser Storage",
    garageTitle: "Your Garage",
    garageDescription: "Manage the vehicles you want to track.",
    addVehicle: "Add Vehicle",
    addVehicleTitle: "Add New Vehicle",
    addVehicleDescription:
      "Enter the details of your vehicle to start tracking it.",
    vehicleImage: "Vehicle Image",
    make: "Make",
    makePlaceholder: "e.g. Toyota",
    model: "Model",
    modelPlaceholder: "e.g. Camry",
    vehicleType: "Type",
    vehicleTypePlaceholder: "Select type",
    vehicleTypeOptions: {
      car: "Car",
      motorcycle: "Motorcycle",
      truck: "Truck",
    },
    powertrain: "Powertrain",
    powertrainPlaceholder: "Select powertrain",
    powertrainOptions: {
      ice: "Combustion (ICE)",
      ev: "Electric (EV)",
      phev: "Plug-in Hybrid (PHEV)",
      hev: "Hybrid (HEV)",
      rex: "Range Extender (REX)",
    },
    year: "Year",
    baselineDistance: (unit: string) => `Initial Distance (${unit})`,
    batteryCapacity: "Battery Capacity (kWh)",
    optional: "(Optional)",
    batteryCapacityPlaceholder: "e.g. 75",
    addingVehicle: "Adding...",
    vehicleAdded: "Vehicle added successfully!",
    vehicleDeleted: "Vehicle deleted.",
    loadingGarage: "Loading garage...",
    emptyGarageTitle: "Your garage is empty",
    emptyGarageDescription:
      "Add a vehicle to start tracking your fuel and maintenance.",
    active: "Active",
    deleteVehicle: "Delete",
    currencies: [
      { value: "₹", label: "Indian Rupee (₹)" },
      { value: "$", label: "US Dollar ($)" },
      { value: "£", label: "British Pound (£)" },
      { value: "€", label: "Euro (€)" },
      { value: "¥", label: "Japanese Yen (¥)" },
    ],
  },
} as const;
