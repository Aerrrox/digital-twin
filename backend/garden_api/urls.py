from django.urls import path
from .views import (
    PlotList, NewPlot, BedList, NewBed,
    UpdatePlot, DeletePlot,
    UpdateBed, DeleteBed,
    AddPlant, BedPlant, # UpdatePlant, DeletePlant
)

urlpatterns = [
    path('user/<int:user_id>/plot_list', PlotList.as_view(), name='plot_list'),
    path('user/<int:user_id>/new_plot', NewPlot.as_view(), name='new_plot'),
    path('plot/<int:plot_id>/update', UpdatePlot.as_view(), name='update_plot'),
    path('plot/<int:plot_id>/delete', DeletePlot.as_view(), name='delete_plot'),

    path('plot/<int:plot_id>/bed_list', BedList.as_view(), name='bed_list'),
    path('plot/<int:plot_id>/new_bed', NewBed.as_view(), name='new_bed'),
    path('bed/<int:bed_id>/update', UpdateBed.as_view(), name='update_bed'),
    path('bed/<int:bed_id>/delete', DeleteBed.as_view(), name='delete_bed'),

    path('bed/<int:bed_id>/add_plant', AddPlant.as_view(), name='add_plant'),
    path('bed/<int:bed_id>/plant', BedPlant.as_view(), name='plant_list'),
    # path('plant/<int:plant_id>/update', UpdatePlant.as_view(), name='update_plant'),
    # path('plant/<int:plant_id>/delete', DeletePlant.as_view(), name='delete_plant'),
]