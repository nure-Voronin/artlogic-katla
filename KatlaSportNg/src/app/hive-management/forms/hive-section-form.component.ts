import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HiveSection } from "../models/hive-section";
import { HiveSectionService } from "../services/hive-section.service";

@Component({
  selector: "app-hive-section-form",
  templateUrl: "./hive-section-form.component.html",
  styleUrls: ["./hive-section-form.component.css"],
})
export class HiveSectionFormComponent implements OnInit {
  hiveSection = new HiveSection(0, "", "", 0, false, "");
  existed = false;
  StoreHiveId = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hiveSectionService: HiveSectionService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((p) => {
      console.log(p);
      if (p["id"] !== undefined) {
        this.hiveSectionService
          .getHiveSection(p["id"])
          .subscribe((h) => (this.hiveSection = h));
        this.existed = true;
      }
      if (p["hiveId"] !== undefined) {
        this.StoreHiveId = p["hiveId"];
        this.hiveSection.storeHiveId = p["hiveId"];
      }
    });
  }

  navigateToHives() {
    this.router.navigate(["/hives"]);
  }

  onCancel() {
    this.navigateToHives();
  }

  onSubmit() {
    if (this.existed) {
      this.hiveSectionService
        .updateHiveSection(this.hiveSection, this.StoreHiveId)
        .subscribe((h) => this.navigateToHives());
    } else {
      this.hiveSectionService
        .addHiveSection(this.hiveSection)
        .subscribe((h) => this.navigateToHives());
    }
  }

  onDelete() {
    this.hiveSectionService
      .setHiveSectionStatus(this.hiveSection.id, true)
      .subscribe((h) => (this.hiveSection.isDeleted = true));
  }

  onUndelete() {
    this.hiveSectionService
      .setHiveSectionStatus(this.hiveSection.id, false)
      .subscribe((h) => (this.hiveSection.isDeleted = false));
  }

  onPurge() {
    this.hiveSectionService
      .deleteHiveSection(this.hiveSection.id)
      .subscribe((h) => this.navigateToHives());
  }
}
