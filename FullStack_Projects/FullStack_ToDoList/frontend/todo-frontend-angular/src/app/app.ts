import { Component, OnInit } from '@angular/core';
import { TaskService } from './task'; 
import { FormsModule } from '@angular/forms'; 
import { NgFor } from '@angular/common'; 
import { DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule, 
    NgFor,
    DragDropModule       
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})


export class App implements OnInit {
  
  
  tasks: any[] = [];
  newTaskTitle: string = '';

  
  constructor(private taskService: TaskService) {}

 
  

  ngOnInit() {
    this.loadTasks();
  }

 
  loadTasks() {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data;
    });
  }

  
  createTask() {
    if (this.newTaskTitle.trim() === '') return; 

    this.taskService.addTask({ title: this.newTaskTitle }).subscribe(() => {
      this.loadTasks(); 
      this.newTaskTitle = ''; 
    });
  }

  
  toggleComplete(task: any) {
    task.completed = !task.completed;
    this.taskService.updateTask(task).subscribe();
  }

  
  deleteTask(task: any) {
    this.taskService.deleteTask(task.id).subscribe(() => {
      this.loadTasks(); 
    });
  }

  onDrop(event: CdkDragDrop<any[]>){
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
  }
}