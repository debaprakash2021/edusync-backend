import Quiz from "../models/quiz.model.js";
import QuizAttempt from "../models/quizAttempt.model.js";
import Enrollment from "../models/enrollment.model.js";

export const createQuizService = async (data, instructorId) => {
  const quiz = await Quiz.create(data);
  return quiz;
};

export const getQuizService = async (quizId, studentId) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("Quiz not found");

  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: quiz.course,
  });
  if (!enrollment) throw new Error("Not enrolled in this course");

  const sanitized = quiz.toObject();
  sanitized.questions = sanitized.questions.map((q) => ({
    ...q,
    options: q.options.map(({ text, _id }) => ({ text, _id })),
    explanation: undefined,
  }));

  return sanitized;
};

export const submitQuizService = async (quizId, studentId, answers, timeTakenSeconds) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("Quiz not found");

  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: quiz.course,
  });
  if (!enrollment) throw new Error("Not enrolled in this course");

  let correctCount = 0;
  const gradedAnswers = answers.map(({ questionId, selectedOptionId }) => {
    const question = quiz.questions.id(questionId);
    if (!question) return { question: questionId, selectedOption: selectedOptionId, isCorrect: false };

    const selectedOption = question.options.id(selectedOptionId);
    const isCorrect = selectedOption?.isCorrect === true;
    if (isCorrect) correctCount++;

    return { question: questionId, selectedOption: selectedOptionId, isCorrect };
  });

  const score = quiz.questions.length > 0
    ? Math.round((correctCount / quiz.questions.length) * 100)
    : 0;

  const isPassed = score >= quiz.passingScore;

  const attempt = await QuizAttempt.create({
    student: studentId,
    quiz: quizId,
    course: quiz.course,
    answers: gradedAnswers,
    score,
    isPassed,
    timeTakenSeconds,
  });

  const quizWithAnswers = quiz.toObject();
  return {
    attemptId: attempt._id,
    score,
    isPassed,
    passingScore: quiz.passingScore,
    correctCount,
    totalQuestions: quiz.questions.length,
    questions: quizWithAnswers.questions,
  };
};

export const getMyAttemptsService = async (quizId, studentId) => {
  const attempts = await QuizAttempt.find({ quiz: quizId, student: studentId })
    .sort({ createdAt: -1 });
  return attempts;
};