from django.urls import path
from .views import (
    PlotList, NewPlot, BedList, NewBed,
    UpdatePlot, DeletePlot,
    UpdateBed, DeleteBed,
    AddPlant, BedPlant, 
    PlantList, WaterBed,
    BedStatus, RemovePlant,
    BedsInGroup, ChangeBedGroup,
    WaterBedsInGroup, ResetGroup
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
    path('bed/<int:bed_id>/remove_plant/', RemovePlant.as_view(), name='remove_plant'),
    path('bed/<int:bed_id>/plant', BedPlant.as_view(), name='bed_plant'),
    path('plants/', PlantList.as_view(), name='plant_list'),
    path('bed/<int:bed_id>/water/', WaterBed.as_view(), name='water_bed'),
    path('bed/<int:bed_id>/status/', BedStatus.as_view(), name='bed_status'),

    path('beds/group/<int:group_id>/', BedsInGroup.as_view(), name='beds_in_group'),
    path('bed/<int:bed_id>/change_group/', ChangeBedGroup.as_view(), name='change_bed_group'),
    path('beds/group/<int:group_id>/water/', WaterBedsInGroup.as_view(), name='mass_water_beds'),
    path('beds/group/<int:group_id>/reset/', ResetGroup.as_view(), name='reset_bed_group'),
]