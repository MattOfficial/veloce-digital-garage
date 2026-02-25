# Veloce (Fuel Tracker V2): The Road Ahead

Now that the core MVP of tracking Fuel, Maintenance, and Custom Events is complete, here are some conceptual ideas for transforming the app from a simple a tracker into a proactive "Digital Garage" ecosystem.

## 1. AI-Powered "Check Engine" Diagnostics (OBD2 Integration)
- **Concept**: Allow users to input standard OBD2 trouble codes (e.g., `P0420`). The system uses an LLM to translate the deep technical jargon into an easily understandable diagnosis.
- **Action**: "Your Catalytic Converter is operating below threshold. It's safe to drive to a mechanic, but fuel efficiency will drop. Estimated repair cost: $400 - $800."
- **Why it matters**: It empowers users and stops them from being ripped off by predatory mechanics.

## 2. Dynamic Trip Cost Calculator
- **Concept**: A simple widget where a user types "Going to Seattle" or drops a pin on a map. 
- **Action**: Based on the exact vehicle's historical running cost, fuel efficiency, and current local gas prices, the app outputs: *"This 400-mile round trip will cost approximately $62.80 in fuel."*
- **Why it matters**: Turns raw historical data into forward-looking, actionable utility.

## 3. Preventative Maintenance Cadences
- **Concept**: A system that stops relying on the user to remember tasks. 
- **Action**: Using the app's knowledge of the user's average daily driving distance (calculated from fuel intervals in V1), the app can dynamically trigger push notifications: *"You are approaching 5,000 miles since your last oil change. Tap here to log a new service."*
- **Why it matters**: It makes the app sticky. The app works for the user in the background, rather than the user only logging data when they remember.

## 4. OCR Receipt Scanning
- **Concept**: Nobody likes manually typing in gas prices while freezing at a pump.
- **Action**: The user snaps a photo of the tiny paper receipt. The app uses OCR (like Google Cloud Vision or generic LLM Vision) to extract Date, Total Cost, Price Per Gallon/Liter, and Total Volume, auto-filling the Fill-Up form.
- **Why it matters**: Eliminates friction perfectly for the primary core loop. Can be built rapidly using Vercel AI SDK.

## The Next Step
The core foundation is incredibly solid. The step from V1 to V2 isn't about *more data*, it's about making the existing data *smarter* and *proactive*.
