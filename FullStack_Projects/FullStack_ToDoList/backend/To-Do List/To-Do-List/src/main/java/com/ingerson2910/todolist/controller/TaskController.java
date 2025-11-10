package com.ingerson2910.todolist.controller;

import com.ingerson2910.todolist.model.Task;
import com.ingerson2910.todolist.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @PostMapping
    public Task createTask(@RequestBody Task task){
        return taskRepository.save(task);
    }

    @GetMapping
    public List<Task> getAllTasks(){
        return taskRepository.findAll();
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task taskDetails){
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setCompleted(taskDetails.isCompleted());
        task.setTitle(taskDetails.getTitle());
        return taskRepository.save(task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id){
        taskRepository.deleteById(id);
    }
}
