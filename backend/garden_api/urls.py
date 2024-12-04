from django.urls import path
from .views import PlotList, NewPlot

urlpatterns = [
    path('user/<int:user_id>/plot_list', PlotList.as_view(), name='plot_list'),
    path('user/<int:user_id>/new_plot', NewPlot.as_view(), name='new_plot'),
]