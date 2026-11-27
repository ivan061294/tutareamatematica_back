"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = exports.CourseCategory = exports.CourseLevel = void 0;
var CourseLevel;
(function (CourseLevel) {
    CourseLevel["BEGINNER"] = "beginner";
    CourseLevel["INTERMEDIATE"] = "intermediate";
    CourseLevel["ADVANCED"] = "advanced";
})(CourseLevel || (exports.CourseLevel = CourseLevel = {}));
var CourseCategory;
(function (CourseCategory) {
    CourseCategory["ALGEBRA"] = "algebra";
    CourseCategory["CALCULUS"] = "calculus";
    CourseCategory["GEOMETRY"] = "geometry";
    CourseCategory["STATISTICS"] = "statistics";
    CourseCategory["TRIGONOMETRY"] = "trigonometry";
    CourseCategory["ARITHMETIC"] = "arithmetic";
})(CourseCategory || (exports.CourseCategory = CourseCategory = {}));
class Course {
}
exports.Course = Course;
//# sourceMappingURL=course.entity.js.map