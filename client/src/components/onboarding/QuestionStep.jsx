import OptionCard from "./OptionCard";

function QuestionStep({ question, stepNumber, value, onSelect }) {
  const isMultiple = question.selectionType === "multiple";
  const headingId = `${question.id}-heading`;

  return (
    <section role="group" aria-labelledby={headingId}>
      <p className="mb-4 text-xs font-bold tracking-[0.2em] text-momentum-lime">
        STEP {stepNumber}
      </p>
      <h1
        id={headingId}
        className="font-display m-0 max-w-xl text-4xl leading-[1.08] text-[#f5f5f7] sm:text-5xl"
      >
        {question.title}
      </h1>
      <p className="mt-4 text-base font-medium text-momentum-muted">
        {question.description}
      </p>

      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {question.options.map((option) => (
          <OptionCard
            key={option.value}
            option={option}
            name={question.id}
            multiple={isMultiple}
            selected={
              isMultiple
                ? value.includes(option.value)
                : value === option.value
            }
            onChange={onSelect}
          />
        ))}
      </div>
    </section>
  );
}

export default QuestionStep;
