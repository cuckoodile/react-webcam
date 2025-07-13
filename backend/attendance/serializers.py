from rest_framework import serializers

from .models import Attendance

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['id', 'img', 'created_at']

    def create(self, validated_data):
        return Attendance.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.img = validated_data.get('img', instance.img)
        instance.save()
        return instance