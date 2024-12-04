from django.urls import path
from .views import PlotList, NewPlot, BedList, NewBed

urlpatterns = [
    path('user/<int:user_id>/plot_list', PlotList.as_view(), name='plot_list'),
    path('user/<int:user_id>/new_plot', NewPlot.as_view(), name='new_plot'),
    path('plot/<int:plot_id>/bed_list', BedList.as_view(), name='bed_list'),
    path('plot/<int:plot_id>/new_bed', NewBed.as_view(), name='new_bed'),
]