from django.db import models

class SalesData(models.Model):
    date = models.DateField(auto_now_add=True)
    total_sales = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_orders = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['-date']
        verbose_name_plural = 'Sales Data'
    
    def __str__(self):
        return f"Sales on {self.date} - {self.total_sales}"
