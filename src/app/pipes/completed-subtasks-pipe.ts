import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'completedSubtasks',
})
export class CompletedSubtasksPipe implements PipeTransform {
  transform(subtasks: { title: string; isCompleted: boolean }[]): number {
    return subtasks.filter((subtask) => subtask.isCompleted).length;
  }
}
