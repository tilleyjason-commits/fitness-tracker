import { useState } from 'react';
import { ExerciseSelector } from './ExerciseSelector';
import { routineHasItems, routineItemFromCardio, routineItemFromExercise, WEEKDAYS } from '../routines';
import type { CardioEquipment, DailyRoutine, Exercise, RoutineCardioExercise, RoutineExercise, Weekday, WeeklyRoutines } from '../types';

interface WeeklyRoutinesProps {
  routines: WeeklyRoutines;
  todayDay: Weekday;
  onSaveRoutine: (routine: DailyRoutine) => void;
  onAddRoutineToWorkout: (routine: DailyRoutine) => void;
  onReplaceWorkoutWithRoutine: (routine: DailyRoutine) => void;
}

export function WeeklyRoutines({
  routines,
  todayDay,
  onSaveRoutine,
  onAddRoutineToWorkout,
  onReplaceWorkoutWithRoutine,
}: WeeklyRoutinesProps) {
  const initialRoutine = routines[todayDay];
  const [selectedDay, setSelectedDay] = useState<Weekday>(todayDay);
  const [name, setName] = useState(initialRoutine.name);
  const [exercises, setExercises] = useState<RoutineExercise[]>(initialRoutine.exercises);
  const [cardioExercises, setCardioExercises] = useState<RoutineCardioExercise[]>(initialRoutine.cardioExercises);

  const todayRoutine = routines[todayDay];

  function selectDay(day: Weekday) {
    const routine = routines[day];
    setSelectedDay(day);
    setName(routine.name);
    setExercises(routine.exercises);
    setCardioExercises(routine.cardioExercises);
  }

  function handleSave() {
    onSaveRoutine({
      day: selectedDay,
      name: name.trim(),
      exercises,
      cardioExercises,
    });
  }

  function addExercise(exercise: Exercise, sets: number, reps: number, weight: number) {
    setExercises(prev => [...prev, routineItemFromExercise(exercise, sets, reps, weight)]);
  }

  function addCardio(equipment: CardioEquipment, durationMinutes: number, distanceMiles: number) {
    setCardioExercises(prev => [...prev, routineItemFromCardio(equipment, durationMinutes, distanceMiles)]);
  }

  const selectedItemCount = exercises.length + cardioExercises.length;

  return (
    <section className="weekly-routines">
      <div className="routine-header">
        <div>
          <span className="eyebrow">Weekly plan</span>
          <h2 className="section-title">Weekly Routines</h2>
        </div>
      </div>

      <div className="today-routine-card">
        <div>
          <span className="eyebrow">Today's routine</span>
          <h3>{todayRoutine.name || `${todayDay} Routine`}</h3>
          <p>
            {routineHasItems(todayRoutine)
              ? `${todayRoutine.exercises.length} strength · ${todayRoutine.cardioExercises.length} cardio`
              : `No ${todayDay} routine saved yet.`}
          </p>
        </div>
        {routineHasItems(todayRoutine) && (
          <div className="routine-load-actions">
            <button className="add-btn" onClick={() => onAddRoutineToWorkout(todayRoutine)}>Add to Workout</button>
            <button className="secondary-btn" onClick={() => onReplaceWorkoutWithRoutine(todayRoutine)}>Replace Workout</button>
          </div>
        )}
      </div>

      <div className="day-tabs">
        {WEEKDAYS.map(day => (
          <button
            key={day}
            className={`muscle-tab${selectedDay === day ? ' active' : ''}`}
            onClick={() => selectDay(day)}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="routine-editor">
        <label className="routine-name-field">
          Routine name
          <input
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder={`${selectedDay} Routine`}
          />
        </label>

        <ExerciseSelector title={`Add to ${selectedDay} Preset`} addLabel="Add to Preset" onAdd={addExercise} onAddCardio={addCardio} />

        <div className="routine-items">
          <h3>{selectedDay} preset items</h3>
          {selectedItemCount === 0 ? (
            <p>No preset items yet. Add strength or cardio above.</p>
          ) : (
            <>
              {exercises.map((item, index) => (
                <div className="routine-item" key={`${item.exercise.id}-${index}`}>
                  <span>{item.exercise.name}</span>
                  <small>{item.targetSets} × {item.targetReps} · {item.targetWeight} lb</small>
                  <button onClick={() => setExercises(prev => prev.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
                </div>
              ))}
              {cardioExercises.map((item, index) => (
                <div className="routine-item" key={`${item.equipment.id}-${index}`}>
                  <span>{item.equipment.name}</span>
                  <small>{item.durationMinutes} min{item.distanceMiles > 0 ? ` · ${item.distanceMiles} mi` : ''}</small>
                  <button onClick={() => setCardioExercises(prev => prev.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
                </div>
              ))}
            </>
          )}
        </div>

        <button className="save-routine-btn" onClick={handleSave}>Save {selectedDay} Preset</button>
      </div>
    </section>
  );
}
