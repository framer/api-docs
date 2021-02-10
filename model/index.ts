/**
 * FramerAPI module. This defines all of the types for our FramerAPI data structure
 * that is available via the FramerAPI class in the React codebase. The class provides
 * methods for looking up model objects in the JSON data.
 *
 * Each model is mapped in the JSON object by an ID, this is the "fullname" for the
 * class e.g BezierAnimator.isFinished() followed by the "cannonicalReference". We
 * need this additional reference to help differentiate between static and instance
 * properties as well as method overloads (see: toId in generator.ts for more details).
 *
 * For each model there is an XProps interface and a RawXProps interface, the latter
 * is for typing the JSON structure where we flatten the relationships to just id
 * keys.
 */
export * from "./types"
export * from "./FramerAPI"
