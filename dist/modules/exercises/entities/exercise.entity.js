"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exercise = exports.ExerciseOption = exports.ExerciseType = exports.ExerciseDifficulty = void 0;
var ExerciseDifficulty;
(function (ExerciseDifficulty) {
    ExerciseDifficulty["EASY"] = "easy";
    ExerciseDifficulty["MEDIUM"] = "medium";
    ExerciseDifficulty["HARD"] = "hard";
})(ExerciseDifficulty || (exports.ExerciseDifficulty = ExerciseDifficulty = {}));
var ExerciseType;
(function (ExerciseType) {
    ExerciseType["MULTIPLE_CHOICE"] = "multiple_choice";
    ExerciseType["OPEN_ENDED"] = "open_ended";
    ExerciseType["TRUE_FALSE"] = "true_false";
    ExerciseType["FILL_BLANK"] = "fill_blank";
})(ExerciseType || (exports.ExerciseType = ExerciseType = {}));
class ExerciseOption {
}
exports.ExerciseOption = ExerciseOption;
class Exercise {
}
exports.Exercise = Exercise;
//# sourceMappingURL=exercise.entity.js.map