// "use client";
// import { cn } from "@/lib/utils";
// import { AnimatePresence, motion } from "motion/react";
// import { useState, useEffect } from "react";

// const CheckIcon = ({ className }: { className?: string }) => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//       strokeWidth={1.5}
//       stroke="currentColor"
//       className={cn("w-6 h-6 ", className)}
//     >
//       <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
//     </svg>
//   );
// };

// const CheckFilled = ({ className }: { className?: string }) => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//       className={cn("w-6 h-6 ", className)}
//     >
//       <path
//         fillRule="evenodd"
//         d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
//         clipRule="evenodd"
//       />
//     </svg>
//   );
// };

// const CrossIcon = ({ className }: { className?: string }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" className={cn("w-8 h-8", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
//     <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// type LoadingState = {
//   text: string;
// };

// const LoaderCore = ({
//   loadingStates,
//   value = 0,
// }: {
//   loadingStates: LoadingState[];
//   value?: number;
// }) => {
//   return (
//     <div className="flex relative justify-start max-w-xl mx-auto flex-col mt-40">
//       {loadingStates.map((loadingState, index) => {
//         const distance = Math.abs(index - value);
//         const opacity = Math.max(1 - distance * 0.2, 0);

//         return (
//           <motion.div
//             key={index}
//             className={cn("text-left flex gap-2 mb-4")}
//             initial={{ opacity: 0, y: -(value * 40) }}
//             animate={{ opacity: opacity, y: -(value * 40) }}
//             transition={{ duration: 0.5 }}
//           >
//             <div>
//               {index > value && (
//                 <CheckIcon className="text-black dark:text-white" />
//               )}
//               {index <= value && (
//                 <CheckFilled
//                   className={cn(
//                     "text-black dark:text-white",
//                     value === index && "text-black dark:text-lime-500 opacity-100"
//                   )}
//                 />
//               )}
//             </div>
//             <span
//               className={cn(
//                 "text-black dark:text-white",
//                 value === index && "text-black dark:text-lime-500 opacity-100"
//               )}
//             >
//               {loadingState.text}
//             </span>
//           </motion.div>
//         );
//       })}
//     </div>
//   );
// };

// export const MultiStepLoader = ({
//   loadingStates,
//   loading,
//   duration = 2000,
//   loop = true,
//   // Controlled props:
//   value,
//   finished,
//   error,
//   onFinish,
// }: {
//   loadingStates: LoadingState[];
//   loading?: boolean;
//   duration?: number;
//   loop?: boolean;
//   // when `value` is provided the loader is in controlled mode and will not auto-advance
//   value?: number;
//   // show success animation (parent sets true when done)
//   finished?: boolean;
//   // show error message overlay (parent sets a string message to indicate an error)
//   error?: string | null;
//   // callback invoked after finish animation completes
//   onFinish?: () => void;
// }) => {
//   const [currentState, setCurrentState] = useState(0);
//   const controlled = typeof value === "number";

//   // sync controlled value into internal state (for rendering)
//   useEffect(() => {
//     if (controlled) {
//       setCurrentState(value as number);
//     }
//   }, [value, controlled]);

//   // Auto-advance only when uncontrolled (backwards compatible)
//   useEffect(() => {
//     if (controlled) return;
//     if (!loading) {
//       setCurrentState(0);
//       return;
//     }
//     const timeout = setTimeout(() => {
//       setCurrentState((prevState) =>
//         loop
//           ? prevState === loadingStates.length - 1
//             ? 0
//             : prevState + 1
//           : Math.min(prevState + 1, loadingStates.length - 1)
//       );
//     }, duration);

//     return () => clearTimeout(timeout);
//   }, [currentState, loading, loop, loadingStates.length, duration, controlled]);

//   // When finished becomes true, run a small animation then call onFinish (if provided)
//   useEffect(() => {
//     if (finished) {
//       const t = setTimeout(() => {
//         onFinish?.();
//       }, 900);
//       return () => clearTimeout(t);
//     }
//   }, [finished, onFinish]);

//   return (
//     <AnimatePresence mode="wait">
//       {loading && !finished && !error && (
//         <motion.div
//           initial={{
//             opacity: 0,
//           }}
//           animate={{
//             opacity: 1,
//           }}
//           exit={{
//             opacity: 0,
//           }}
//           className="w-full h-full fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-2xl"
//         >
//           <div className="h-96  relative">
//             <LoaderCore value={currentState} loadingStates={loadingStates} />
//           </div>

//           <div className="bg-gradient-to-t inset-x-0 z-20 bottom-0 bg-white dark:bg-black h-full absolute [mask-image:radial-gradient(900px_at_center,transparent_30%,white)]" />
//         </motion.div>
//       )}

//       {/* Success overlay */}
//       {loading && finished && !error && (
//         <motion.div
//           key="success"
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.95 }}
//           className="w-full h-full fixed inset-0 z-[110] flex items-center justify-center"
//         >
//           <motion.div
//             initial={{ y: 12, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             className="rounded-lg bg-white dark:bg-neutral-900 border shadow-lg px-8 py-8 flex flex-col items-center justify-center"
//           >
//             <CheckFilled className="text-lime-600 w-12 h-12" />
//             <div className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
//               All done
//             </div>
//             <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
//               Your action completed successfully.
//             </div>
//           </motion.div>
//         </motion.div>
//       )}

//       {/* Error overlay */}
//       {loading && error && (
//         <motion.div
//           key="error"
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.95 }}
//           className="w-full h-full fixed inset-0 z-[120] flex items-center justify-center"
//         >
//           <motion.div
//             initial={{ y: 8, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             className="rounded-lg bg-white dark:bg-neutral-900 border shadow-lg px-8 py-6 flex flex-col items-center justify-center max-w-sm"
//           >
//             <CrossIcon className="text-red-600" />
//             <div className="mt-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
//               Something went wrong
//             </div>
//             <div className="mt-2 text-sm text-red-600 text-center">{error}</div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// /* 

// Add the advance() imperative API to the loader,
// */

// "use client";
// import { cn } from "@/lib/utils";
// import { AnimatePresence, motion } from "motion/react";
// import { useState, useEffect } from "react";

// const CheckIcon = ({ className }: { className?: string }) => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//       strokeWidth={1.5}
//       stroke="currentColor"
//       className={cn("w-6 h-6 ", className)}
//     >
//       <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
//     </svg>
//   );
// };

// const CheckFilled = ({ className }: { className?: string }) => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//       className={cn("w-6 h-6 ", className)}
//     >
//       <path
//         fillRule="evenodd"
//         d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
//         clipRule="evenodd"
//       />
//     </svg>
//   );
// };

// const CrossIcon = ({ className }: { className?: string }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" className={cn("w-8 h-8", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
//     <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// type LoadingState = {
//   text: string;
// };

// const LoaderCore = ({
//   loadingStates,
//   value = 0,
// }: {
//   loadingStates: LoadingState[];
//   value?: number;
// }) => {
//   return (
//     <div className="flex relative justify-start max-w-xl mx-auto flex-col mt-40">
//       {loadingStates.map((loadingState, index) => {
//         const distance = Math.abs(index - value);
//         const opacity = Math.max(1 - distance * 0.2, 0);

//         return (
//           <motion.div
//             key={index}
//             className={cn("text-left flex gap-2 mb-4")}
//             initial={{ opacity: 0, y: -(value * 40) }}
//             animate={{ opacity: opacity, y: -(value * 40) }}
//             transition={{ duration: 0.5 }}
//           >
//             <div>
//               {index > value && (
//                 <CheckIcon className="text-black dark:text-white" />
//               )}
//               {index <= value && (
//                 <CheckFilled
//                   className={cn(
//                     "text-black dark:text-white",
//                     value === index && "text-black dark:text-lime-500 opacity-100"
//                   )}
//                 />
//               )}
//             </div>
//             <span
//               className={cn(
//                 "text-black dark:text-white",
//                 value === index && "text-black dark:text-lime-500 opacity-100"
//               )}
//             >
//               {loadingState.text}
//             </span>
//           </motion.div>
//         );
//       })}
//     </div>
//   );
// };

// export const MultiStepLoader = ({
//   loadingStates,
//   loading,
//   duration = 2000,
//   loop = true,
//   // Controlled props:
//   value,
//   finished,
//   error,
//   onFinish,
// }: {
//   loadingStates: LoadingState[];
//   loading?: boolean;
//   duration?: number;
//   loop?: boolean;
//   // when `value` is provided the loader is in controlled mode and will not auto-advance
//   value?: number;
//   // show success animation (parent sets true when done)
//   finished?: boolean;
//   // show error message overlay (parent sets a string message to indicate an error)
//   error?: string | null;
//   // callback invoked after finish animation completes
//   onFinish?: () => void;
// }) => {
//   const [currentState, setCurrentState] = useState(0);
//   const controlled = typeof value === "number";

//   // sync controlled value into internal state (for rendering)
//   useEffect(() => {
//     if (controlled) {
//       setCurrentState(value as number);
//     }
//   }, [value, controlled]);

//   // Auto-advance only when uncontrolled (backwards compatible)
//   useEffect(() => {
//     if (controlled) return;
//     if (!loading) {
//       setCurrentState(0);
//       return;
//     }
//     const timeout = setTimeout(() => {
//       setCurrentState((prevState) =>
//         loop
//           ? prevState === loadingStates.length - 1
//             ? 0
//             : prevState + 1
//           : Math.min(prevState + 1, loadingStates.length - 1)
//       );
//     }, duration);

//     return () => clearTimeout(timeout);
//   }, [currentState, loading, loop, loadingStates.length, duration, controlled]);

//   // When finished becomes true, run a small animation then call onFinish (if provided)
//   useEffect(() => {
//     if (finished) {
//       const t = setTimeout(() => {
//         onFinish?.();
//       }, 900);
//       return () => clearTimeout(t);
//     }
//   }, [finished, onFinish]);

//   return (
//     <AnimatePresence mode="wait">
//       {loading && !finished && !error && (
//         <motion.div
//           initial={{
//             opacity: 0,
//           }}
//           animate={{
//             opacity: 1,
//           }}
//           exit={{
//             opacity: 0,
//           }}
//           className="w-full h-full fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-2xl"
//         >
//           <div className="h-96  relative">
//             <LoaderCore value={currentState} loadingStates={loadingStates} />
//           </div>

//           <div className="bg-gradient-to-t inset-x-0 z-20 bottom-0 bg-white dark:bg-black h-full absolute [mask-image:radial-gradient(900px_at_center,transparent_30%,white)]" />
//         </motion.div>
//       )}

//       {/* Success overlay */}
//       {loading && finished && !error && (
//         <motion.div
//           key="success"
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.95 }}
//           className="w-full h-full fixed inset-0 z-[110] flex items-center justify-center"
//         >
//           <motion.div
//             initial={{ y: 12, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             className="rounded-lg bg-white dark:bg-neutral-900 border shadow-lg px-8 py-8 flex flex-col items-center justify-center"
//           >
//             <CheckFilled className="text-lime-600 w-12 h-12" />
//             <div className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
//               All done
//             </div>
//             <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
//               Your action completed successfully.
//             </div>
//           </motion.div>
//         </motion.div>
//       )}

//       {/* Error overlay */}
//       {loading && error && (
//         <motion.div
//           key="error"
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.95 }}
//           className="w-full h-full fixed inset-0 z-[120] flex items-center justify-center"
//         >
//           <motion.div
//             initial={{ y: 8, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             className="rounded-lg bg-white dark:bg-neutral-900 border shadow-lg px-8 py-6 flex flex-col items-center justify-center max-w-sm"
//           >
//             <CrossIcon className="text-red-600" />
//             <div className="mt-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
//               Something went wrong
//             </div>
//             <div className="mt-2 text-sm text-red-600 text-center">{error}</div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };