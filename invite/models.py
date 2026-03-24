from django.db import models

class Guest(models.Model):
    STATUS_CHOICES =[
        ('yes', 'Да, приду'),
        ('no', 'Нет, не приду'),
        ('with_spouse', 'Приду с супругой/ом'),
    ]
    first_name = models.CharField('Имя', max_length=100)
    last_name = models.CharField('Фамилия', max_length=100)
    status = models.CharField('Статус', max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField('Дата ответа', auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.get_status_display()}"

class Wish(models.Model):
    name = models.CharField('Имя', max_length=150)
    text = models.TextField('Пожелание')
    created_at = models.DateTimeField('Дата', auto_now_add=True)

    def __str__(self):
        return self.name