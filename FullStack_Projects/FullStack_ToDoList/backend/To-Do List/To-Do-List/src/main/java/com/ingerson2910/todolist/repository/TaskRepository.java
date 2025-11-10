package com.ingerson2910.todolist.repository;

import com.ingerson2910.todolist.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}
